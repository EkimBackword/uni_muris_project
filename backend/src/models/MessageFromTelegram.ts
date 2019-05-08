import {
    Table, Column, Model, HasMany, CreatedAt,
    UpdatedAt, DataType, Validate, DefaultScope,
    BelongsToMany, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { Request } from 'express';
import User, { IUser } from './User';


export interface IMessageFromTelegram {
    ID?: number;
    Message: string;

    CreatedAt?: Date;
    ReplyAt?: Date;
    ReplyMessage?: string;

    UserID: number;
    TeacherID?: number;

    User?: IUser;
    Teacher?: IUser;
}

@Table
export default class MessageFromTelegram extends Model<MessageFromTelegram> implements IMessageFromTelegram {
    @Column({ primaryKey: true, type: DataType.INTEGER, autoIncrement: true })
    ID: number;
    @Column({ type: DataType.STRING })
    Message: string;

    @Column({ type: DataType.DATE, allowNull: true })
    ReplyAt?: Date;
    @Column({ type: DataType.STRING, allowNull: true })
    ReplyMessage?: string;

    @CreatedAt
    CreatedAt?: Date;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    UserID: number;
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: true })
    TeacherID?: number;

    @BelongsTo(() => User, 'UserID')
    User?: IUser;
    @BelongsTo(() => User, 'TeacherID')
    Teacher?: IUser;


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