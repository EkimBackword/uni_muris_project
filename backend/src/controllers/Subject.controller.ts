import { Application, Request, Response, NextFunction, Router } from 'express';
import { isAuth, requireAdmin } from '../authentication';
import Subject, { ISubject } from './../models/Subject';
import User from './../models/User';
import UserToSubject from './../models/UserToSubject';
import Lesson, { ILesson } from './../models/Lessons';

export class SubjectController {
    constructor(app: Application) {
        const router = Router();
        router.get('/search/:term', isAuth, this.search);
        router.get('/list', isAuth, this.getList);
        router.get('/list/:group_id', isAuth, this.getListByGroupID);
        router.post('/add', requireAdmin, this.add);
        router.patch('/edit/:id', requireAdmin, this.edit);
        router.delete('/:id', requireAdmin, this.delete);

        app.use('/subject', router);
    }

    private async add (req: Request, res: Response) {
        const error = await Subject.checkFullModel(req);
        if (error != null) return res.status(400).json(error);

        try {
            const data: ISubject = {
                Title: req.body.Title
            };
            let newSubject = new Subject(data);
            newSubject = await newSubject.save();

            const IDs: string[] = req.body.TeachersID;
            if (IDs === void 0) return res.status(204).json();
            IDs.forEach(async (id) => {
                try {
                    const Teacher = await User.findById<User>(id);
                    if (Teacher !== void 0) {
                        const link = new UserToSubject({
                            UserID: Teacher.ID,
                            SubjectID: newSubject.ID,
                        });
                        await link.save();
                    }
                } catch (err) {
                    console.log(`Пользователя с ID = ${id} не существует`);
                }
            });
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    private async search (req: Request, res: Response) {
        try {
            const term: string = req.params.term;
            const list = await Subject.findAll<Subject>({ limit: 10, where: { Title: { $like: `%${term}%`} } });
            const result = list.map(item => item.toJSON());
            return res.json(result);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    private async getList (req: Request, res: Response) {
        try {
            const list = await Subject.findAll<Subject>({ include: [ User ]});
            const result = list.map(item => item.toJSON());
            return res.json(result);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    private async getListByGroupID (req: Request, res: Response) {
        const SearchID: number = parseInt(req.params.group_id);
        try {
            const lessonList = await Lesson.findAll<Lesson>({ attributes: ['Subject.ID', 'Subject.Title'], where: { GroupID: SearchID }, include: [ Subject ], group: ['Subject.ID'] });
            const result = lessonList.map(l => {
                const lesson: ILesson = l.toJSON();
                return lesson.Subject;
            });
            return res.json(result);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    private async edit (req: Request, res: Response) {
        const error = await Subject.checkFullModel(req);
        if (error != null) return res.status(400).json(error);

        try {
            const id: string = req.params.id;
            const subject = await Subject.findById<Subject>(id, {include: [ User ]});
            if (!subject || subject === null) {
                return res.status(404).json({ message: 'Такого предмета не существует'});
            }
            subject.Title = req.body.Title;
            const fromBodyIDs: number[] = req.body.TeachersID;
            if (fromBodyIDs === void 0) {
                await subject.save();
                return res.status(204).json();
            }
            const forDelete = subject.Teachers.filter(t => fromBodyIDs.every(id => id !== t.ID));
            const forAdd = fromBodyIDs.filter(id => subject.Teachers.every(t => id !== t.ID));
            forDelete.forEach(async (t) => {
                const link = await UserToSubject.find<UserToSubject>({where: {
                    UserID: t.ID,
                    SubjectID: subject.ID
                }});
                await link.destroy();
            });
            forAdd.forEach(async (id) => {
                try {
                    const Teacher = await User.findById<User>(id);
                    if (Teacher !== void 0) {
                        const link = new UserToSubject({
                            UserID: Teacher.ID,
                            SubjectID: subject.ID,
                        });
                        await link.save();
                    }
                } catch (err) {
                    console.log(`Пользователя с ID = ${id} не существует`, err);
                }
            });
            await subject.save();
            return res.status(204).json();
        } catch (err) {
            console.warn(err);
            return res.status(500).json(err.message);
        }
    }

    private async delete (req: Request, res: Response) {
        const id = req.params.id;
        const subject = await Subject.findById<Subject>(id);
        try {
            await subject.destroy();
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json(err);
        }
    }
}