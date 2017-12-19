import {
    Table, Column, Model, HasMany, CreatedAt,
    UpdatedAt, DataType, Validate, DefaultScope, BelongsToMany, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { Request } from 'express';
import Group, { IGroup } from './Group';
import Subject, { ISubject } from './Subject';
import StudentToLesson, { IStudentToLesson } from './StudentToLesson';
import File, { IFile } from './Files';

export interface ILesson {
    ID?: number;
    SubjectID: number;
    GroupID: number;
    Date: Date;
    Title: string;
    Description: string;

    Group?: IGroup;
    Subject?: ISubject;

    StudentsInfo?: IStudentToLesson[];
    Files?: IFile[];
}

@Table
export default class Lesson extends Model<Lesson> implements ILesson {
    @Column({ primaryKey: true, type: DataType.INTEGER, autoIncrement: true })
    ID: number;
    @ForeignKey(() => Subject)
    @Column({ type: DataType.INTEGER })
    SubjectID: number;
    @ForeignKey(() => Group)
    @Column({ type: DataType.INTEGER })
    GroupID: number;
    @Column({ type: DataType.STRING })
    Title: string;
    @Column({ type: DataType.STRING({length: 1024}) })
    Description: string;
    @Column({ type: DataType.DATE })
    Date: Date;

    @BelongsTo(() => Group, 'GroupID')
    Group?: IGroup;
    @BelongsTo(() => Subject, 'SubjectID')
    Subject?: ISubject;

    @HasMany(() => StudentToLesson, 'LessonID')
    StudentsInfo?: IStudentToLesson[];
    @HasMany(() => File, 'LessonID')
    Files?: IFile[];


    /**
     * @description Проверка полной модели пришедшей в запросе
     * @param req Объект запроса
     */
    static async checkFullModel(req: Request, withoutPassword: boolean = false ) {
        req.assert('SubjectID', 'SubjectID не может быть пустым').notEmpty();
        req.assert('GroupID', 'GroupID не может быть пустым').notEmpty();
        req.assert('Title', 'Title не может быть пустым').notEmpty();
        req.assert('Description', 'Description не может быть пустым').notEmpty();
        req.assert('Date', 'Date не может быть пустым').notEmpty();

        const errors = await req.getValidationResult();
        if (errors.isEmpty()) return null;
        return errors.array({onlyFirstError: true})[0];
    }
}