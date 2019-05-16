import { Application, Request, Response, NextFunction, Router } from 'express';
import { Model, Sequelize } from 'sequelize-typescript';
import * as passport from 'passport';
import { isAuth, requireAdmin } from '../authentication';
const passwordHash = require('password-hash');

import User, { IUser, UserRoles } from '../models/User';
import Group from '../models/Group';
import Subject from '../models/Subject';
import StudentToLesson, { IStudentToLesson, VisitStatusEnum } from '../models/StudentToLesson';
import UserToSubject from '../models/UserToSubject';
import Lesson from '../models/Lessons';

import * as multer from 'multer';

const storage = multer.diskStorage(
    {
        destination: 'files/',
        filename: function ( req, file, cb ) {
            // req.body is empty... here is where req.body.new_file_name doesn't exists
            cb( null, file.originalname );
        }
    }
);
const uploader = multer({ dest: 'files/', storage: storage });

export class UserController {
    constructor(app: Application) {
        const router = Router();
        router.post('/login', passport.authenticate('local'), this.login);
        router.get('/logout', this.logout);

        router.get('/profile', isAuth, this.profile);
        router.get('/list', isAuth, this.list);
        router.get('/search/:term', isAuth, this.search);
        router.post('/add', this.add);
        router.patch('/edit/:id', requireAdmin, this.edit);

        router.post('/upload-file', isAuth, uploader.single('file'), this.fileUpload);

        router.delete('/:id', requireAdmin, this.delete);

        app.use('/user', router);
    }

    private async fileUpload(req: Request, res: Response, next: NextFunction) {
        // console.log(req.file);
        // console.log(req.body);
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
        const currentUser: User = await User.findByPk<User>(req.user.ID, { include: includes });
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
                if (!req.body.GroupID) {
                    return res.status(400).json({ message: 'Пользователь с ролью СТУДЕНТ должен иметь номер группы!'});
                }
                data.GroupID = req.body.GroupID;
            }

            let newUser = new User(data);
            newUser = await newUser.save();
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    protected async createStudentToLessonLink(userID: number, subjectID: number) {
        const lessons = await Lesson.findAll<Lesson>({where: {SubjectID: subjectID}});
        lessons.forEach( async lesson => {
            const StudInfo: IStudentToLesson = {
                Description: '',
                UserID: userID,
                LessonID: lesson.ID,
                VisitStatus: VisitStatusEnum.unknown,
                Score: 0,
            };
            await new StudentToLesson(StudInfo).save();
        });
    }

    private async edit(req: Request, res: Response) {
        const error = await User.checkFullModel(req, true);
        if (error != null) return res.status(400).json(error);

        const id = req.params.id;
        const CurrentUser = await User.findByPk<User>(id);
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
                if (!req.body.GroupID) {
                    return res.status(400).json({ message: 'Пользователь с ролью СТУДЕНТ должен иметь номер группы'});
                }
                CurrentUser.GroupID = req.body.GroupID;
            }

            await CurrentUser.save();
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    private async list(req: Request, res: Response) {
        const WHERE: any = {};
        const GroupID = req.query.GroupID;
        if (GroupID !== void 0) {
            WHERE['GroupID'] = GroupID;
        }
        const data = await User.findAll<User>({ where: WHERE });
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
        const user = await User.findByPk<User>(id, {include: [ Subject ]});
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