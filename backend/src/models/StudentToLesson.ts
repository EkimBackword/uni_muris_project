import {
    Table, Column, Model, HasMany, CreatedAt,
    UpdatedAt, DataType, Validate, DefaultScope, BelongsToMany, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { Request } from 'express';
import User, { IUser } from './User';
import Lesson, { ILesson } from './Lessons';
import File, { IFile } from './Files';

export interface IStudentToLesson {
    ID?: number;
    UserID: number;
    LessonID: number;
    VisitStatus: VisitStatusEnum;
    Score: number;
    Description: string;

    Student?: IUser;
    Lesson?: ILesson;
    Files?: IFile[];
}

export enum VisitStatusEnum {
    unknown,
    visit,
    miss
}

@Table
export default class StudentToLesson extends Model<StudentToLesson> implements IStudentToLesson {
    @Column({ primaryKey: true, type: DataType.INTEGER, autoIncrement: true })
    ID: number;
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    UserID: number;
    @ForeignKey(() => Lesson)
    @Column({ type: DataType.INTEGER })
    LessonID: number;
    @Column({ type: DataType.STRING({length: 1024}) })
    Description: string;
    @Column({ type: DataType.INTEGER })
    VisitStatus: VisitStatusEnum;
    @Column({ type: DataType.INTEGER, allowNull: true })
    Score: number;

    @BelongsTo(() => User, 'UserID')
    Student?: IUser;
    @BelongsTo(() => Lesson, 'LessonID')
    Lesson?: ILesson;

    @HasMany(() => File, 'StudentInfoID')
    Files?: IFile[];
}