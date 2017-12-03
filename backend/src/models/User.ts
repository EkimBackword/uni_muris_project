import {
    Table, Column, Model, HasMany, CreatedAt,
    UpdatedAt, DataType, Validate, DefaultScope, BelongsToMany
} from 'sequelize-typescript';
import { Request } from 'express';

export interface IUser {
    ID?: number;
    Login: string;
    FIO: string;
    Role: UserRoles;
    Hash: string;

    Group?: string;
    StartYear?: number;
}

export enum UserRoles {
    admin = 'admin',
    student = 'student',
    teacher = 'teacher'
}

@Table
export default class User extends Model<User> implements IUser {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    ID: number;
    @Column({ type: DataType.STRING })
    Login: string;
    @Column({ type: DataType.STRING })
    FIO: string;
    @Column({ type: DataType.STRING })
    Role: UserRoles;
    @Column({ type: DataType.STRING, allowNull: true })
    Group?: string;
    @Column({ type: DataType.INTEGER, allowNull: true })
    StartYear?: number;
    @Column({ type: DataType.STRING })
    Hash: string;

    /**
     * @description Проверка полной модели пришедшей в запросе
     * @param req Объект запроса
     */
    static async checkFullModel(req: Request) {
        req.assert('Login', 'Логин не может быть пустым').notEmpty();
        req.assert('Password', 'Пароль не может быть пустым').notEmpty();
        req.assert('FIO', 'ФИО не может быть пустым').notEmpty();
        req.assert('Role', 'Роль должна быть одной из списка (Админнистратор, преподаватель или студент)').notEmpty();

        const errors = await req.getValidationResult();
        if (errors.isEmpty()) return null;
        return errors.array({onlyFirstError: true})[0];
    }

    /**
     * @description Проверка модели запроса авторизации
     * @param req Объект запроса
     */
    static async checkLoginModel(req: Request) {
        req.assert('Login', 'Логин не может быть пустым').notEmpty();
        req.assert('Password', 'Пароль не может быть пустым').notEmpty();

        const errors = await req.getValidationResult();
        if (errors.isEmpty()) return null;
        return errors.array({onlyFirstError: true})[0];
    }
}