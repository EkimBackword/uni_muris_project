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

    constructor() {
        const config = TELEGRAM_CONFIG.needProxy ? { telegram: { agent: this.socksAgent } } : {};
        this.bot = new Telegraf(TELEGRAM_CONFIG.apiToken, config);
        this.init();
        (this.bot as any).catch((err: any) => {
            // console.log('Ooops', err);
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
        this.actionHandler();
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
1) /sign_up [Login]:[Password]
2) /any_command
2) /test
`);
    }

    private commandHandler() {
        this.bot.command('sign_up', (ctx) => this.sign_up(ctx));
        this.bot.command('any_command', (ctx) => this.any_command(ctx));
        this.bot.command('test', (ctx) => this.test(ctx));
    }

    private async sign_up(ctx: ContextMessageUpdate) {
        const msg = /\/sign_up (.*)/.exec(ctx.message.text);

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
            return ctx.reply(`Произошла ошибка!`);
        }
    }

    private async any_command(ctx: ContextMessageUpdate) {
        const user: any = null; // await User.find<User>({ where: { 'ChatID': ctx.chat.id } });
        if (user) {
            (ctx as any).session.user = user.toJSON();
            return ctx.reply('В данный момент отсутствуют турниры, в которые производиться набор участников');

        } else {
            return ctx.reply('Пожалуйста зарегистрируйтесь, как участник турниров с помощью команды /check_in [BattleTag]:[Password]');
        }
    }
    private async test(ctx: ContextMessageUpdate) {
        const users = await User.findAll<User>();
        console.log(users);
        return ctx.reply(`TEST: ${users.length}`);
    }

    private actionHandler() {
        (this.bot as any).action(/(any|some):select:(.*)/, (ctx: ContextMessageUpdate) => this.select(ctx));
    }

    private async select(ctx: ContextMessageUpdate) {
        const match = (ctx as any).match;
        return ctx.reply(`Select! ${match[1]}`);
    }

    private hearsHandler() {
        this.bot.hears(/[П,п]ривет/i, (ctx) => ctx.reply('Приветствую тебя'));
        this.bot.hears(/(.*) [П,п]ока (.*)/i, (ctx) => {
            // console.log((ctx as any).match);
            return ctx.reply('Пока пока');
        });
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