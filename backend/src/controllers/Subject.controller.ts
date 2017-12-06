import { Application, Request, Response, NextFunction, Router } from 'express';
import { isAuth, requireAdmin } from '../authentication';
import Subject, { ISubject } from './../models/Subject';

export class SubjectController {
    constructor(app: Application) {
        const router = Router();
        router.get('/search/:term', isAuth, this.search);
        router.get('/list', isAuth, this.getList);
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
            const newSubject = new Subject(data);
            await newSubject.save();
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
            const list = await Subject.findAll<Subject>();
            const result = list.map(item => item.toJSON());
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
            const subject = await Subject.findById<Subject>(id);
            if (!subject || subject === null) {
                return res.status(404).json({ message: 'Такого предмета не существует'});
            }
            subject.Title = req.body.Title;
            await subject.save();
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json(err);
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