import {
    Table, Column, Model, HasMany, CreatedAt,
    UpdatedAt, DataType, Validate, DefaultScope,
    BelongsToMany, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { Request } from 'express';
import User, { IUser } from './User';
import Dialogs, { IDialog } from './Dialogs';


export interface IMessageFromDialog {
    ID?: number;
    DialogID: number;
    UserID: number;
    EncryptedMessage: string;

    CreatedAt?: Date;
    UpdatedOn?: Date;

    ReplyID?: number;
    Reply?: IMessageFromDialog;

    Dialog?: IDialog;
    User?: IUser;
}

@Table
export default class MessageFromDialogs extends Model<MessageFromDialogs> implements IMessageFromDialog {
    @Column({ primaryKey: true, type: DataType.INTEGER, autoIncrement: true })
    ID: number;
    @Column({ type: DataType.STRING })
    EncryptedMessage: string;

    @CreatedAt
    CreatedAt?: Date;
    @UpdatedAt
    UpdatedOn?: Date;

    @ForeignKey(() => MessageFromDialogs)
    @Column({ type: DataType.INTEGER, allowNull: true })
    ReplyID?: number;
    @ForeignKey(() => Dialogs)
    @Column({ type: DataType.INTEGER })
    DialogID: number;
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    UserID: number;

    @BelongsTo(() => MessageFromDialogs, 'ReplyID')
    Reply?: IMessageFromDialog;
    @BelongsTo(() => Dialogs, 'DialogID')
    Dialog?: IDialog;
    @BelongsTo(() => User, 'UserID')
    User?: IUser;


    /**
     * @description Проверка полной модели пришедшей в запросе
     * @param req Объект запроса
     */
    static async checkFullModel(req: Request, withoutPassword: boolean = false ) {
        req.assert('DialogID', 'DialogID не может быть пустым').notEmpty();
        req.assert('UserID', 'UserID не может быть пустым').notEmpty();
        req.assert('EncryptedMessage', 'EncryptedMessage не может быть пустым').notEmpty();

        const errors = await req.getValidationResult();
        if (errors.isEmpty()) return null;
        return errors.array({onlyFirstError: true})[0];
    }
}