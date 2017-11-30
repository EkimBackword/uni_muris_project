import * as passport from 'passport';
const passwordHash = require('password-hash');
import { Strategy } from 'passport-local';
import User, { IUser } from './models/User';

passport.serializeUser((user: IUser, done) => {
    // console.log('serializeUser', user);
    done(null, user.ID);
});

passport.deserializeUser((id, done) => {
    console.log('deserializeUser', id);
    User.findOne<User>({ where: { ID: id } })
        .then((user) => {
            done(null, user);
        })
});

passport.use(new Strategy({
        usernameField: 'Login',
        passwordField: 'Password'
    },
    async (username, password, done) => {
        findUser(username, (err, user) => {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false, { message: 'Некорректый Логин' })
            }
            if (!passwordHash.verify(password, user.Hash)) {
                return done(null, false, { message: 'Некорректый Пароль' })
            }
            return done(null, user)
        })
    })
)

let findUser = async (username: string, callback: (err: any, user?: IUser) => any) => {
    try {
        const _user = await User.findOne<User>({ where: { Login: username } });
        callback(null, _user.toJSON());
    } catch (err) {
        callback(err);
    }
}