import {
    Table, Column, Model, HasMany, CreatedAt,
    UpdatedAt, DataType, Validate, DefaultScope, BelongsToMany, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { Request } from 'express';
import StudentToLesson, { IStudentToLesson } from './StudentToLesson';
import Lesson, { ILesson } from './Lessons';

export interface IFile {
    ID?: number;
    Path: string;
    Name: string;
    Ext: string;

    StudentInfoID?: number;
    LessonID?: number;

    StudentInfo?: IStudentToLesson;
    Lesson?: ILesson;
}

@Table
export default class File extends Model<File> implements IFile {
    @Column({ primaryKey: true, type: DataType.INTEGER, autoIncrement: true })
    ID: number;
    @Column({ type: DataType.STRING })
    Path: string;
    @Column({ type: DataType.STRING })
    Name: string;
    @Column({ type: DataType.STRING })
    Ext: string;

    @ForeignKey(() => StudentToLesson)
    @Column({ type: DataType.INTEGER, allowNull: true })
    StudentInfoID?: number;
    @ForeignKey(() => Lesson)
    @Column({ type: DataType.INTEGER, allowNull: true })
    LessonID?: number;

    @BelongsTo(() => StudentToLesson, 'StudentInfoID')
    StudentInfo?: IStudentToLesson;
    @BelongsTo(() => Lesson, 'LessonID')
    Lesson?: ILesson;
}