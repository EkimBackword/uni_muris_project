import { Table, ForeignKey, Column, DataType, Model } from 'sequelize-typescript';
import User from './User';
import Subject from './Subject';

export interface IStudentToSubject {
    UserID?: number;
    SubjectID: number;
    IsActivated?: boolean;
}

@Table
export default class StudentToSubject extends Model<StudentToSubject> implements IStudentToSubject {
    @ForeignKey(() => User)
    @Column({ primaryKey: true, type: DataType.INTEGER })
    UserID: number;

    @ForeignKey(() => Subject)
    @Column({ primaryKey: true, type: DataType.INTEGER })
    SubjectID: number;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    IsActivated?: boolean;
}