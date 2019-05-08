import {
    Table, Column, Model, HasMany, CreatedAt,
    UpdatedAt, DataType, Validate, DefaultScope,
    BelongsToMany, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { Request } from 'express';
import User, { IUser } from './User';


export interface INotice {
    ID?: number;
    Title: string;
    Description: string;

    Type: 'news' | 'notice';
    IsActive: boolean;
    IsHidden: boolean;

    CreatedAt?: Date;

    UserID: number;
    User: IUser;
}

@Table
export default class Notice extends Model<Notice> implements INotice {
    @Column({ primaryKey: true, type: DataType.INTEGER, autoIncrement: true })
    ID: number;
    @Column({ type: DataType.STRING })
    Title: string;
    @Column({ type: DataType.STRING })
    Description: string;

    @Column({ type: DataType.STRING })
    Type: 'news' | 'notice';
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    IsActive: boolean;
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    IsHidden: boolean;


    @CreatedAt
    CreatedAt?: Date;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    UserID: number;
    @BelongsTo(() => User, 'UserID')
    User: IUser;


    /**
     * @description Проверка полной модели пришедшей в запросе
     * @param req Объект запроса
     */
    static async checkFullModel(req: Request, withoutPassword: boolean = false ) {
        req.assert('Title', 'Title не может быть пустым').notEmpty();
        req.assert('Description', 'Description не может быть пустым').notEmpty();
        req.assert('Type', 'Type не может быть пустым').notEmpty();
        req.assert('UserID', 'UserID не может быть пустым').notEmpty();

        const errors = await req.getValidationResult();
        if (errors.isEmpty()) return null;
        return errors.array({onlyFirstError: true})[0];
    }
}