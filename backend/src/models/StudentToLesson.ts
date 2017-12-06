import {
    Table, Column, Model, HasMany, CreatedAt,
    UpdatedAt, DataType, Validate, DefaultScope, BelongsToMany, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { Request } from 'express';
import Group, { IGroup } from './Group';
import Subject, { ISubject } from './Subject';
import User, { IUser } from './User';
import Lesson, { ILesson } from './Lessons';
import File, { IFile } from './Files';

export interface IStudentToLesson {
    ID: number;
    UserID: number;
    LessonID: number;
    VisitStatus: VisitStatusEnum;
    Description: string;

    Student?: IUser;
    Lesson?: ILesson;
    Files?: any[];
}

export enum VisitStatusEnum {
    unknown,
    visit,
    miss
}

@Table
export default class StudentToLesson extends Model<StudentToLesson> implements IStudentToLesson {
    @Column({ primaryKey: true, type: DataType.INTEGER })
    ID: number;
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    UserID: number;
    @ForeignKey(() => Lesson)
    @Column({ type: DataType.INTEGER })
    LessonID: number;
    @Column({ type: DataType.STRING })
    Description: string;
    @Column({ type: DataType.INTEGER })
    VisitStatus: VisitStatusEnum;

    @BelongsTo(() => User, 'UserID')
    Student?: IUser;
    @BelongsTo(() => Lesson, 'LessonID')
    Lesson?: ILesson;

    @HasMany(() => File, 'StudentInfoID')
    Files?: IFile[];
}