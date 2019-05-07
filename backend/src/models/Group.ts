import {
    Table, Column, Model, HasMany, CreatedAt,
    UpdatedAt, DataType, Validate, DefaultScope, BelongsToMany
} from 'sequelize-typescript';
import { Request } from 'express';
import User, { IUser } from './User';
import Lesson, { ILesson } from './Lessons';

export interface IGroup {
    ID: number;
    Title: string;
    Year?: number;

    Students?: IUser[];
    Lessons?: ILesson[];
}

@Table
export default class Group extends Model<Group> implements IGroup {
    @Column({ primaryKey: true, type: DataType.INTEGER })
    ID: number;
    @Column({ type: DataType.STRING })
    Title: string;
    @Column({ type: DataType.INTEGER, defaultValue: 1 })
    Year?: number;

    @HasMany(() => User, 'GroupID')
    Students?: IUser[];
    @HasMany(() => Lesson, 'GroupID')
    Lessons?: ILesson[];

    /**
     * @description Проверка полной модели пришедшей в запросе
     * @param req Объект запроса
     */
    static async checkFullModel(req: Request) {
        req.assert('ID', 'Номер (ID) группы обязательно к заполнению').notEmpty();
        req.assert('Title', 'Название группы обязательно к заполнению').notEmpty();

        const errors = await req.getValidationResult();
        if (errors.isEmpty()) return null;
        return errors.array({onlyFirstError: true})[0];
    }
}