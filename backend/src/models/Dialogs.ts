import {
    Table, Column, Model, HasMany, CreatedAt,
    UpdatedAt, DataType, Validate, DefaultScope,
    BelongsToMany, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { Request } from 'express';
import Subject, { ISubject } from './Subject';
import UserToDialogs, { IUserToDialogs } from './UserToDialogs';


export interface IDialog {
    ID?: number;
    Name: string;
    Description: string;
    SecretPassphrase: string;
    ImgUrl?: string;

    SubjectID?: number;
    Subject?: ISubject;
    Users?: IUserToDialogs[];
}

@Table
export default class Dialogs extends Model<Dialogs> implements IDialog {
    @Column({ primaryKey: true, type: DataType.INTEGER, autoIncrement: true })
    ID: number;
    @Column({ type: DataType.STRING })
    Name: string;
    @Column({ type: DataType.STRING })
    Description: string;
    @Column({ type: DataType.STRING })
    SecretPassphrase: string;
    @Column({ type: DataType.STRING, allowNull: true })
    ImgUrl?: string;

    @ForeignKey(() => Subject)
    @Column({ type: DataType.INTEGER, allowNull: true })
    SubjectID?: number;
    @BelongsTo(() => Subject, 'SubjectID')
    Subject?: ISubject;

    @HasMany(() => UserToDialogs, 'DialogID')
    Users?: IUserToDialogs[];


    /**
     * @description Проверка полной модели пришедшей в запросе
     * @param req Объект запроса
     */
    static async checkFullModel(req: Request, withoutPassword: boolean = false ) {
        req.assert('Name', 'Name не может быть пустым').notEmpty();
        req.assert('Description', 'Description не может быть пустым').notEmpty();

        const errors = await req.getValidationResult();
        if (errors.isEmpty()) return null;
        return errors.array({onlyFirstError: true})[0];
    }
}