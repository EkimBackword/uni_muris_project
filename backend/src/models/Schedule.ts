import {
    Table, Column, Model, HasMany, CreatedAt,
    UpdatedAt, DataType, Validate, DefaultScope, BelongsToMany, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { Request } from 'express';
import Timetable, { ITimetable } from './Timetable';
import Group, { IGroup } from './Group';

export interface ISchedule {
    ID?: number;
    Name: string;
    Teacher: string;
    Room: string;
    isEven: boolean;
    isOdd: boolean;

    NumberID: number;
    TimetableNumber?: ITimetable;
}

@Table
export default class Schedule extends Model<Schedule> implements ISchedule {
    @Column({ primaryKey: true, type: DataType.INTEGER, autoIncrement: true })
    ID: number;
    @Column({ type: DataType.STRING })
    Name: string;
    @Column({ type: DataType.STRING })
    Teacher: string;
    @Column({ type: DataType.STRING })
    Room: string;
    @Column({ type: DataType.BOOLEAN })
    isEven: boolean;
    @Column({ type: DataType.BOOLEAN })
    isOdd: boolean;

    @ForeignKey(() => Timetable)
    @Column({ type: DataType.INTEGER })
    NumberID: number;
    @BelongsTo(() => Timetable, 'NumberID')
    TimetableNumber?: ITimetable;

    @ForeignKey(() => Group)
    @Column({ type: DataType.INTEGER, allowNull: true })
    GroupID?: number;
    @BelongsTo(() => Group, 'GroupID')
    Group?: IGroup;

    /**
     * @description Проверка полной модели пришедшей в запросе
     * @param req Объект запроса
     */
    static async checkFullModel(req: Request) {
        req.assert('Name', 'Name обязательно к заполнению').notEmpty();
        req.assert('Teacher', 'Teacher обязательно к заполнению').notEmpty();
        req.assert('Room', 'Room обязательно к заполнению').notEmpty();
        req.assert('isEven', 'isEven обязательно к заполнению').notEmpty();
        req.assert('isOdd', 'isOdd обязательно к заполнению').notEmpty();
        req.assert('NumberID', 'NumberID обязательно к заполнению').notEmpty();

        const errors = await req.getValidationResult();
        if (errors.isEmpty()) return null;
        return errors.array({onlyFirstError: true})[0];
    }
}