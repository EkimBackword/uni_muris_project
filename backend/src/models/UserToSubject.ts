import { Table, ForeignKey, Column, DataType, Model } from 'sequelize-typescript';
import User from './User';
import Subject from './Subject';

@Table
export default class UserToSubject extends Model<UserToSubject> {
    @ForeignKey(() => User)
    @Column({ primaryKey: true, type: DataType.INTEGER })
    UserID: number;

    @ForeignKey(() => Subject)
    @Column({ primaryKey: true, type: DataType.INTEGER })
    SubjectID: number;
}