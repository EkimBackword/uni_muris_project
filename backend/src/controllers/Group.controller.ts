import { Application, Request, Response, NextFunction, Router } from 'express';
import { isAuth, requireAdmin } from '../authentication';
import Group, { IGroup } from './../models/Group';
import User from '../models/User';
import Lesson from '../models/Lessons';

export class GroupController {
    constructor(app: Application) {
        const router = Router();
        router.get('/search/:term', isAuth, this.search);
        router.get('/list', isAuth, this.getList);
        router.post('/add', requireAdmin, this.add);
        router.patch('/edit/:id', requireAdmin, this.edit);
        router.delete('/:id', requireAdmin, this.delete);

        app.use('/group', router);
    }

    private async add (req: Request, res: Response) {
        const error = await Group.checkFullModel(req);
        if (error != null) return res.status(400).json(error);

        try {
            const data: IGroup = {
                ID: req.body.ID,
                Title: req.body.Title
            };
            const newGroup = new Group(data);
            await newGroup.save();
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    private async search (req: Request, res: Response) {
        try {
            const term: string = req.params.term;
            const list = await Group.findAll<Group>();
            const result = list.filter(item => item.Title.toLowerCase().indexOf(term.toLowerCase()) > -1 || item.ID.toString().indexOf(term) > -1)
                                .map(item => item.toJSON());

            return res.json(result);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    private async getList (req: Request, res: Response) {
        try {
            const list = await Group.findAll<Group>();
            const result = list.map(item => item.toJSON());
            return res.json(result);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    private async edit (req: Request, res: Response) {
        const error = await Group.checkFullModel(req);
        if (error != null) return res.status(400).json(error);

        try {
            const id: string = req.params.id;
            const group = await Group.findById<Group>(id);
            if (!group || group === null) {
                return res.status(404).json({ message: 'Такого предмета не существует'});
            }
            group.Title = req.body.Title;
            await group.save();
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    private async delete (req: Request, res: Response) {
        const id = req.params.id;
        const group = await Group.findById<Group>(id, {include: [User, Lesson]});
        group.Students.forEach(async (s: User) => {
            s.GroupID = null;
            await s.save();
        });
        group.Lessons.forEach(async (l: any) => {
            l.GroupID = null;
            await l.save();
        });
        try {
            await group.destroy();
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json(err);
        }
    }
}