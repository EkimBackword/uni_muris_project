import { Application, Request, Response, NextFunction, Router } from 'express';
import { Model, Sequelize } from 'sequelize-typescript';
import * as passport from 'passport';
import { isAuth, requireAdmin } from '../authentication';
const passwordHash = require('password-hash');

import User, { IUser, UserRoles } from '../models/User';
import Group from '../models/Group';
import Subject from '../models/Subject';
import StudentToLesson from '../models/StudentToLesson';
import UserToSubject from '../models/UserToSubject';

export class UserController {
    constructor(app: Application) {
        const router = Router();
        router.post('/login', passport.authenticate('local'), this.login);
        router.get('/logout', this.logout);

        router.get('/profile', isAuth, this.profile);
        router.get('/list', requireAdmin, this.list);
        router.get('/search/:term', isAuth, this.search);
        router.post('/add', requireAdmin, this.add);
        router.patch('/edit/:id', requireAdmin, this.edit);

        router.delete('/:id', requireAdmin, this.delete);

        app.use('/user', router);
    }

    private async login(req: Request, res: Response) {
        if (req.user) {
            req.login(req.user, (err) => {
                if (err) {
                    return res.status(500).json({message: 'не сработал passport.authenticate'});
                }
                return res.json(req.user);
            });
        }
        else {
            return res.status(500).json({message: 'не сработал passport.authenticate'});
        }
    }

    private async logout(req: Request, res: Response) {
        req.logout();
        return res.json();
    }

    private async profile(req: Request, res: Response) {
        const includes = [];
        if (req.query.withGroup !== void 0) {
            includes.push(Group);
        }
        if (req.query.withSubject !== void 0) {
            includes.push(Subject);
        }
        if (req.query.withLessonsInfo !== void 0) {
            includes.push(StudentToLesson);
        }
        if (includes.length === 0) return res.json(req.user);
        const currentUser: User = await User.findById<User>(req.user.ID, { include: includes });
        const result: IUser = currentUser.toJSON();
        delete result.Hash;
        return res.json(result);
    }

    /**
     * Метод регистрации пользователя
     * @param req Объект запроса
     * @param res Объект ответа
     */
    private async add(req: Request, res: Response) {
        const error = await User.checkFullModel(req);
        if (error != null) return res.status(400).json(error);

        const existsUser = await User.findOne<User>({where: { Login: req.body.Login }});
        if (existsUser != null) {
            return res.status(400).json({ message: 'Пользователь с таким Login уже существует'});
        }

        try {
            const hash = passwordHash.generate(req.body.Password);
            const data: IUser = {
                Login: req.body.Login,
                FIO: req.body.FIO,
                Role: req.body.Role,
                Hash: hash
            };
            if (data.Role === UserRoles.student) {

                if ((typeof req.body.GroupID === 'undefined' || req.body.GroupID === null) && (typeof req.body.StartYear === 'undefined' || req.body.StartYear === null)) {
                    return res.status(400).json({ message: 'Пользователь с ролью СТУДЕНТ должен иметь номер группы и год поступления'});
                }

                data.GroupID = req.body.GroupID;
                data.StartYear = req.body.StartYear;
            }

            const newUser = new User(data);
            await newUser.save();

            return res.status(204).json();
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    private async edit(req: Request, res: Response) {
        const error = await User.checkFullModel(req, true);
        if (error != null) return res.status(400).json(error);

        const id = req.params.id;
        const CurrentUser = await User.findById<User>(id);
        if (CurrentUser === null) {
            return res.status(404).json({ message: 'Такого пользователя нет'});
        }

        try {
            CurrentUser.Login = req.body.Login;
            CurrentUser.FIO = req.body.FIO;
            CurrentUser.Role = req.body.Role;
            if (req.body.Password !== void 0) {
                const hash = passwordHash.generate(req.body.Password);
                CurrentUser.Hash = hash;
            }

            if (CurrentUser.Role === UserRoles.student) {

                if ((typeof req.body.GroupID === 'undefined' || req.body.GroupID === null) && (typeof req.body.StartYear === 'undefined' || req.body.StartYear === null)) {
                    return res.status(400).json({ message: 'Пользователь с ролью СТУДЕНТ должен иметь номер группы и год поступления'});
                }

                CurrentUser.GroupID = req.body.GroupID;
                CurrentUser.StartYear = req.body.StartYear;
            }

            await CurrentUser.save();
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    private async list(req: Request, res: Response) {
        const data = await User.findAll<User>();
        const result = data.map(u => {
            const curUser: IUser = u.toJSON();
            delete curUser.Hash;
            return curUser;
        });
        return res.json(result);
    }

    private async search (req: Request, res: Response) {
        try {
            const term: string = req.params.term;
            const list = await User.findAll<User>();
            const result = list.filter(item => {
                                    if (item.FIO.toLowerCase().indexOf(term.toLowerCase()) > -1) {
                                        if (req.query.role !== void 0) {
                                            return item.Role === req.query.role;
                                        }
                                        return true;
                                    }
                                    return false;
                                })
                                .map(item => item.toJSON());
            return res.json(result);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    private async delete(req: Request, res: Response) {
        const id = req.params.id;
        const user = await User.findById<User>(id, {include: [ Subject ]});
        const list = await UserToSubject.findAll({where: { UserID: user.ID }});
        list.forEach(async i => await i.destroy());
        try {
            await user.destroy();
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json(err);
        }
    }
}