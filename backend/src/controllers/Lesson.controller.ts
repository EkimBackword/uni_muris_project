import { VisitStatusEnum } from './../models/StudentToLesson';
import { Application, Request, Response, NextFunction, Router } from 'express';
import { isAuth, requireAdmin } from '../authentication';
import Lesson, { ILesson } from './../models/Lessons';
import User, { IUser, UserRoles } from '../models/User';
import Group, { IGroup } from '../models/Group';
import Subject, { ISubject } from '../models/Subject';
import StudentToLesson, { IStudentToLesson } from '../models/StudentToLesson';

export class LessonController {
    constructor(app: Application) {
        const router = Router();
        router.get('/list', isAuth, this.getList);
        router.get('/:id', isAuth, this.getLesson);
        router.post('/add', isAuth, this.add);
        router.post('/set', isAuth, this.set);
        router.patch('/edit/:id', isAuth, this.edit);
        router.delete('/:id', isAuth, this.delete);

        app.use('/lesson', router);
    }

    private async add (req: Request, res: Response) {
        const error = await Lesson.checkFullModel(req);
        if (error != null) return res.status(400).json(error);

        try {
            const data: ILesson = {
                SubjectID: req.body.SubjectID,
                Title: req.body.Title,
                Description: req.body.Description,
                Date: req.body.Date,
            };
            let newLesson = new Lesson(data);
            newLesson = await newLesson.save();
            const subjects = await Subject.findById<Subject>(req.body.SubjectID, { include: [ User ] });
            subjects.Students.forEach( async student => {
                const StudInfo: IStudentToLesson = {
                    Description: '',
                    UserID: student.ID,
                    LessonID: newLesson.ID,
                    VisitStatus: VisitStatusEnum.unknown,
                    Score: 0,
                };
                await new StudentToLesson(StudInfo).save();
            });
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    private async getLesson (req: Request, res: Response) {
        try {
            const ID: number = parseInt(req.params.id);
            const lesson = await Lesson.findById<Lesson>(ID, { include: [
                {
                    model: StudentToLesson,
                    include: [ User ]
                }
            ] });
            return res.json(lesson.toJSON());
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    private async getList (req: Request, res: Response) {
        const WHERE: any = {};
        const subjectID = req.query.subjectID;
        if (subjectID !== void 0) {
            WHERE['SubjectID'] = subjectID;
        }
        try {
            const withStudInfo = req.query.withStudInfo;
            const list = withStudInfo === void 0 ?
                            await Lesson.findAll<Lesson>({ where: WHERE }) :
                            await Lesson.findAll<Lesson>({ where: WHERE, include: [
                                {
                                    model: StudentToLesson,
                                    include: [ User ]
                                }
                            ]});
            const result = list.map(item => item.toJSON());
            return res.json(result);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    private async edit (req: Request, res: Response) {
        const error = await Lesson.checkFullModel(req);
        if (error != null) return res.status(400).json(error);

        try {
            const id: string = req.params.id;
            const lesson = await Lesson.findById<Lesson>(id);
            if (!lesson || lesson === null) {
                return res.status(404).json({ message: 'Такого предмета не существует'});
            }
            lesson.SubjectID = req.body.SubjectID;
            lesson.Title = req.body.Title;
            lesson.Description = req.body.Description;
            await lesson.save();
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    private async delete (req: Request, res: Response) {
        try {
            const id = req.params.id;
            const lesson = await Lesson.findById<Lesson>(id);
            await lesson.destroy();
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    private async set (req: Request, res: Response) {
        try {
            const lessonID = req.body.lessonID;
            const userID = req.body.userID;

            const studInfo = await StudentToLesson.findOne<StudentToLesson>({where: { UserID: userID, LessonID: lessonID }});
            if (req.body.type === 'Score') {
                studInfo.Score = req.body.value;
                await studInfo.save();
                return res.status(204).json();
            }
            studInfo.VisitStatus = req.body.value;
            await studInfo.save();
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json(err);
        }
    }
}