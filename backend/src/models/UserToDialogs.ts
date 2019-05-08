import { Table, ForeignKey, Column, DataType, Model, BelongsTo } from 'sequelize-typescript';
import User, { IUser } from './User';
import Dialogs, { IDialog } from './Dialogs';

export interface IUserToDialogs {
    UserID?: number;
    DialogID: number;

    User?: IUser;
    Dialog?: IDialog;
}

@Table
export default class UserToDialogs extends Model<UserToDialogs> implements IUserToDialogs {
    @ForeignKey(() => User)
    @Column({ primaryKey: true, type: DataType.INTEGER })
    UserID: number;

    @ForeignKey(() => Dialogs)
    @Column({ primaryKey: true, type: DataType.INTEGER })
    DialogID: number;

    @BelongsTo(() => User, 'UserID')
    User?: IUser;
    @BelongsTo(() => Dialogs, 'DialogID')
    Dialog?: IDialog;
}