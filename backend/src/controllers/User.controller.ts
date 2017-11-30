import { Application, Request, Response, NextFunction, Router } from 'express';
import { Model, Sequelize } from 'sequelize-typescript';
import * as passport from 'passport';
const passwordHash = require('password-hash');
const uuidv4 = require('uuid/v4');

import User, { IUser, UserRoles } from '../models/User';

export class UserController {
    constructor(app: Application) {
        let router = Router();
        router.post('/add', this.add);
        router.post('/login', passport.authenticate('local'), this.login);
        router.get('/logout', this.logout);
        router.get('/test', this.test);
        // router.delete('/list', this.getList);
        app.use('/user', router);
    }
    
    /**
     * Метод регистрации пользователя
     * @param req 
     * @param res 
     */
    private async add(req: Request, res: Response) {
        let error = await User.checkFullModel(req);
        if(error != null) return res.status(400).json(error);
        
        let existsUser = await User.findOne<User>({where: { Login: req.body.Login }});
        if(existsUser != null) 
            return res.status(400).json({ message: "Пользователь с таким Login уже существует"});
        
        try {
            let hash = passwordHash.generate(req.body.Password);
            let data: IUser = {
                Login: req.body.Login,
                FIO: req.body.FIO,
                Role: req.body.Role,
                Hash: hash
            };
            if (data.Role === UserRoles.student) {

                if ( (typeof req.body.Group === 'undefined' || req.body.Group === null) && 
                    (typeof req.body.StartYear === 'undefined' || req.body.StartYear === null) 
                ) return res.status(400).json({ message: "Пользователь с ролью СТУДЕНТ должен иметь номер группы и год поступления"});

                data.Group = req.body.Group;
                data.StartYear = req.body.StartYear;
            }

            let newUser = new User(data);
            await newUser.save();

            return res.status(204).json();
        } catch(err) {
            return res.status(500).json(err);
        }
    }

    private async login(req: Request, res: Response) {
        if (req.user) {
            // if (req.isAuthenticated()) {
            //     console.log(req.isAuthenticated(), req.user);
            //     req.session.user_id = req.user.ID;
            // }
            req.login(req.user, (err) => {
                if (err) { 
                    return res.status(500).json({message: "не сработал passport.authenticate"});
                }
                console.log(req.isAuthenticated());
                return res.json(req.user);
            })
        }
        else {
            return res.status(500).json({message: "не сработал passport.authenticate"});
        }
    }
    
    private async logout(req: Request, res: Response) {
        req.logout();
        return res.json();
    }

    private async test(req: Request, res: Response) {
        console.log(req.isAuthenticated());
        if (!req.isAuthenticated()) return res.status(401).json({message: 'Не авторизован'});
        return res.json({message: 'Успех'});
    }
}