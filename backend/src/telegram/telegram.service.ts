import Telegraf, { Context, ContextMessageUpdate } from 'telegraf';
const SocksAgent = require('socks5-https-client/lib/Agent');
import { TELEGRAM_CONFIG, SENTRY_CONFIG } from '../config/database.config';
import User, { IUser, UserRoles } from '../models/User';
import { UserController } from '../controllers/User.controller';

const Sentry = require('@sentry/node');
Sentry.init({ dsn: SENTRY_CONFIG.dsn });

const Markup = require('telegraf/markup');
const session = require('telegraf/session');
const passwordHash = require('password-hash');

let Instance: TelegramService = null;

export class TelegramService {
    private bot: Telegraf<ContextMessageUpdate>;
    readonly socksAgent = new SocksAgent({
        socksHost: TELEGRAM_CONFIG.proxy.host,
        socksPort: TELEGRAM_CONFIG.proxy.port,
        socksUsername: TELEGRAM_CONFIG.proxy.login,
        socksPassword: TELEGRAM_CONFIG.proxy.psswd,
    });
    private schedule: any[] = [
        [null, {'even': '2-103 БЖ Тималина  Е.Ю.', 'odd': '2-109 РЯиКР Дасько А.А.', 'base': null}, {'even': null, 'odd': null, 'base': '4-403 Иностранный язык Гаспарян Г.С.'}, {'even': '1-118 БЕЗОПАСНОСТЬ ЖИЗНЕДЕЯТЕЛЬНОСТИ (БЖ) доцент   Тималина  Е.Ю.', 'odd': '1-118 РУССКИЙ  ЯЗЫК  И  КУЛЬТУРА  РЕЧИ (РЯиКР) доцент  Дасько А.А.', 'base': null}, null, null],
        [{'even': null, 'odd': null, 'base': '1-118 МАТЕМАТИЧЕСКИЙ АНАЛИЗ (МА) доцент Копылова Т.В.'}, {'even': null, 'odd': null, 'base': '2-310 МА Копылова Т.В.'}, {'even': null, 'odd': null, 'base': '4-317 История Король М.П.'}, {'even': '1-122 ПРОГРАММИРОВАНИЕ НА ЯЗЫКЕ ВЫСОКОГО УРОВНЯ (ПЯВУ) доцент Сычев П.П.', 'odd': null, 'base': null}, null, null],
        [null, {'even': '2-103 БЖ Тималина  Е.Ю.', 'odd': '2-109 РЯиКР Дасько А.А.', 'base': null}, {'even': null, 'odd': null, 'base': '4-403 Иностранный язык Гаспарян Г.С.'}, {'even': '1-118 БЕЗОПАСНОСТЬ ЖИЗНЕДЕЯТЕЛЬНОСТИ (БЖ) доцент   Тималина  Е.Ю.', 'odd': '1-118 РУССКИЙ  ЯЗЫК  И  КУЛЬТУРА  РЕЧИ (РЯиКР) доцент  Дасько А.А.', 'base': null}, null, null],
        [{'even': null, 'odd': null, 'base': '1-118 МАТЕМАТИЧЕСКИЙ АНАЛИЗ (МА) доцент Копылова Т.В.'}, {'even': null, 'odd': null, 'base': '2-310 МА Копылова Т.В.'}, {'even': null, 'odd': null, 'base': '4-317 История Король М.П.'}, {'even': '1-122 ПРОГРАММИРОВАНИЕ НА ЯЗЫКЕ ВЫСОКОГО УРОВНЯ (ПЯВУ) доцент Сычев П.П.', 'odd': null, 'base': null}, null, null],
        [null, {'even': '2-103 БЖ Тималина  Е.Ю.', 'odd': '2-109 РЯиКР Дасько А.А.', 'base': null}, {'even': null, 'odd': null, 'base': '4-403 Иностранный язык Гаспарян Г.С.'}, {'even': '1-118 БЕЗОПАСНОСТЬ ЖИЗНЕДЕЯТЕЛЬНОСТИ (БЖ) доцент   Тималина  Е.Ю.', 'odd': '1-118 РУССКИЙ  ЯЗЫК  И  КУЛЬТУРА  РЕЧИ (РЯиКР) доцент  Дасько А.А.', 'base': null}, null, null],
        [{'even': null, 'odd': null, 'base': '1-118 МАТЕМАТИЧЕСКИЙ АНАЛИЗ (МА) доцент Копылова Т.В.'}, {'even': null, 'odd': null, 'base': '2-310 МА Копылова Т.В.'}, {'even': null, 'odd': null, 'base': '4-317 История Король М.П.'}, {'even': '1-122 ПРОГРАММИРОВАНИЕ НА ЯЗЫКЕ ВЫСОКОГО УРОВНЯ (ПЯВУ) доцент Сычев П.П.', 'odd': null, 'base': null}, null, null]
    ];

    constructor() {
        const config = TELEGRAM_CONFIG.needProxy ? { telegram: { agent: this.socksAgent } } : {};
        this.bot = new Telegraf(TELEGRAM_CONFIG.apiToken, config);
        this.init();
        (this.bot as any).catch((err: any) => {
            Sentry.captureException(err);
        });
        this.bot.startPolling();
        Instance = this;
    }

    static getInstance() {
        if (Instance === null) {
            Instance = new TelegramService();
        }
        return Instance;
    }

    sendMessage(msg: string, chatId: string|number, extra?: any) {
        return this.bot.telegram.sendMessage(chatId, msg, extra);
    }

    private init() {
        this.bot.use(session());
        this.bot.start((ctx) => this.start(ctx));
        this.bot.help((ctx) => this.help(ctx));
        this.bot.on('sticker', (ctx) => ctx.reply('👍'));

        this.commandHandler();
        this.hearsHandler();
    }

    private start(ctx: ContextMessageUpdate) {
        return ctx.reply(`
Добро пожаловать!
Чтобы узнать, что я умею: /help
        `);
    }

    private help(ctx: ContextMessageUpdate) {
        return ctx.reply(`
Вы можете прислать мне стикер))
Но это не самое главное.

Список команд:
1) /login [Login]:[Password]
1) /logout
2) /getinfo
3) /test
`);
    }

    private commandHandler() {
        this.bot.command('signup', (ctx) => this.sign_up(ctx));
        this.bot.command('login', (ctx) => this.log_in(ctx));
        this.bot.command('logout', (ctx) => this.log_out(ctx));
        this.bot.command('getinfo', (ctx) => this.get_info(ctx));
        this.bot.command('test', (ctx) => this.test(ctx));
    }

    private async sign_up(ctx: ContextMessageUpdate) {
        const msg = /\/signup (.*)/.exec(ctx.message.text);

        try {
            const Login = msg[1].split(':')[0];
            const Password = msg[1].split(':')[1];

            const existsUser = await User.findOne<User>({where: { Login: Login }});
            if (existsUser != null) {
                return ctx.reply('Пользователь с таким Login уже существует');
            }

            const _Password = Password ? Password : this.generatePassword();
            const last_name = ctx.chat.last_name ? ctx.chat.last_name + ' ' : '';
            const first_name = ctx.chat.first_name ? ctx.chat.first_name + ' ' : '';
            let FIO = `${last_name} ${first_name}`;
            if (!last_name && !first_name) {
                FIO = 'NONAME';
            }

            const hash = passwordHash.generate(_Password);
            const data: IUser = {
                Login: Login,
                FIO: FIO,
                Role: UserRoles.admin,
                Hash: hash
            };
            let newUser = new User(data);
            newUser = await newUser.save();
            return ctx.reply(`Вы зарегистрированы на сайте ${TELEGRAM_CONFIG.siteUrl}
Логин: ${Login};
Пароль: ${_Password}
`);
        } catch (err) {
            console.log(err);
            return ctx.reply(`Произошла ошибка!`);
        }
    }

    private async get_info(ctx: ContextMessageUpdate) {
        try {
            const user: User = await User.findOne<User>({ where: { 'TelegramID': ctx.chat.id } });
            if (user) {
                const Login = user.Login ? user.Login : '';
                const FIO = user.FIO ? user.FIO : '';
                const Role = user.Role ? user.Role : '';
                const GroupID = user.GroupID ? user.GroupID : '';
                return ctx.reply(`
Логин: ${Login}
ФИО: ${FIO}
Роль: ${Role}
Номер группы: ${GroupID}`);
            } else {
                return ctx.reply('Пожалуйста авторизуйтесь, как /login [Login]:[Password]');
            }
        } catch (err) {
            console.log(err);
            return ctx.reply(`Произошла ошибка!`);
        }
    }
    private async log_in(ctx: ContextMessageUpdate) {
        let user: User = await User.findOne<User>({ where: { 'TelegramID': ctx.chat.id } });
        if (user) {
            return ctx.reply(`Вы уже авторизованы, как ${user.FIO}.`);
        }

        const msg = /\/login (.*)/.exec(ctx.message.text);
        try {
            if (msg) {
                const Login = msg[1].split(':')[0];
                const Password = msg[1].split(':')[1];
                user =  await User.findOne<User>({ where: { Login: Login } });
                if (!user) {
                    return ctx.reply('Некорректный логин');
                }
                if (!passwordHash.verify(Password, user.Hash)) {
                    return ctx.reply('Некорректный пароль');
                }
                user.TelegramID = ctx.chat.id;
                await user.save();
                return ctx.reply(`Доброго времени суток, ${user.FIO}!`);
            } else {
                return ctx.reply(`Логин и пароль отсутствуют!`);
            }
        } catch (err) {
            console.log(err);
            return ctx.reply(`Произошла ошибка!`);
        }
    }
    private async log_out(ctx: ContextMessageUpdate) {
        try {
            const user: User = await User.findOne<User>({ where: { 'TelegramID': ctx.chat.id } });
            if (user) {
                user.TelegramID = null;
                await user.save();
                return ctx.reply(`До свидания!`);
            } else {
                return ctx.reply(`Вы не авторизованы!`);
            }
        } catch (err) {
            console.log(err);
            return ctx.reply(`Произошла ошибка!`);
        }
    }

    private async test(ctx: ContextMessageUpdate) {
        try {
            const user: User = await User.findOne<User>({ where: { 'TelegramID': ctx.chat.id } });
            if (user) {
                return ctx.reply(`TEST для авторизованного: ${user.FIO}`);
            } else {
                const users = await User.findAll<User>();
                return ctx.reply(`TEST для не авторизованного: Всего пользователей ${users.length}`);
            }
        } catch (err) {
            console.log(err);
            return ctx.reply(`Произошла ошибка!`);
        }
    }

    private hearsHandler() {
        this.bot.hears(/(.*)расписание(.*)/i, (ctx) => this.get_schedule(ctx));
        this.bot.hears(/(.*)[З,з]адани[е,я,й](.*)/i, (ctx) => ctx.reply(`Все задания выполнены!`));
    }

    private async get_schedule(ctx: ContextMessageUpdate) {
        let indexOfDay = new Date().getDay();
        try {
            const time = [ '09:00 - 10:30', '10:40 - 12:10', '12:50 - 14:20', '14:30 - 16:00', '16:10 - 17:40', '17:50 - 19:20'];
            const week = [ '', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье' ];
            let dayWeek = /([П,п]онедельник|[В,в]торник|[С,с]реда|[Ч,ч]етверг|[П,п]ятница|[С,с]уббота|[В,в]оскресенье)/.exec(ctx.message.text);
            if (dayWeek && dayWeek.length > 0) {
                let curentDay = week.find(day =>  day.toLocaleLowerCase() === dayWeek[0].toLocaleLowerCase());
                let index = week.indexOf(curentDay);
                if (index > -1) {
                    indexOfDay = index;
                }
            }
            if (indexOfDay === 7) {
                return ctx.reply(`В воскресенье нет занятий!`);
            }
            const user: User = await User.findOne<User>({ where: { 'TelegramID': ctx.chat.id } });
            if (user) {
                let curSchedule: any[] = this.schedule[indexOfDay];
                return ctx.reply(curSchedule.reduce(
                    (prev, val, index) => {
                        let msg = `
Пара № ${(index + 1)} (${time[index]}): `;
                        if (!val) {
                            msg += `Окно`;
                        } else {
                            if (val.even) {
                                msg += `
\*По чётным неделям\*: ${val.even}`;
                            }
                            if (val.odd) {
                                msg += `
По нечётным неделям: ${val.odd}`;
                            }
                            if (val.base) {
                                msg += `
Каждую неделю: ${val.base}`;
                            }
                        }
                        return prev + msg + `
`;
                    }, `${week[indexOfDay]}
`
                ));
            } else {
                return ctx.reply(`Вы не авторизованы!`);
            }
        } catch (err) {
            console.log(err);
            return ctx.reply(`Произошла ошибка!`);
        }
    }

    private generatePassword() {
        const length = 8;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let retVal = '';
        for (let i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
}