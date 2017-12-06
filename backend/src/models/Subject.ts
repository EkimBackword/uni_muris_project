import {
    Table, Column, Model, HasMany, CreatedAt,
    UpdatedAt, DataType, Validate, DefaultScope, BelongsToMany
} from 'sequelize-typescript';
import { Request } from 'express';
import User, { IUser } from './User';
import UserToSubject from './UserToSubject';
import Lesson, { ILesson } from './Lessons';

export interface ISubject {
    ID?: number;
    Title: string;

    Teachers?: IUser[];
    Lessons?: ILesson[];
}

@Table
export default class Subject extends Model<Subject> implements ISubject {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    ID: number;
    @Column({ type: DataType.STRING })
    Title: string;

    @BelongsToMany(() => User, () => UserToSubject)
    Teachers?: IUser[];
    @HasMany(() => Lesson, 'SubjectID')
    Lessons?: ILesson[];

    /**
     * @description Проверка полной модели пришедшей в запросе
     * @param req Объект запроса
     */
    static async checkFullModel(req: Request) {
        req.assert('Title', 'Название предмета обязательно к заполнению').notEmpty();

        const errors = await req.getValidationResult();
        if (errors.isEmpty()) return null;
        return errors.array({onlyFirstError: true})[0];
    }
}