import {
    Table, Column, Model, HasMany, CreatedAt,
    UpdatedAt, DataType, Validate, DefaultScope, BelongsToMany
} from 'sequelize-typescript';
import { Request } from 'express';

export interface ITimetable {
    NumberID: number;
    TimeStart: Date;
    TimeEnd?: Date;
}

@Table
export default class Timetable extends Model<Timetable> implements ITimetable {
    @Column({ primaryKey: true, type: DataType.INTEGER })
    NumberID: number;
    @Column({ type: DataType.DATE })
    TimeStart: Date;
    @Column({ type: DataType.DATE })
    TimeEnd?: Date;

    /**
     * @description Проверка полной модели пришедшей в запросе
     * @param req Объект запроса
     */
    static async checkFullModel(req: Request) {
        req.assert('NumberID', 'NumberID обязательно к заполнению').notEmpty();
        req.assert('TimeStart', 'TimeStart обязательно к заполнению').notEmpty();
        req.assert('TimeEnd', 'TimeEnd обязательно к заполнению').notEmpty();

        const errors = await req.getValidationResult();
        if (errors.isEmpty()) return null;
        return errors.array({onlyFirstError: true})[0];
    }
}