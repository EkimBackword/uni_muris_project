import {
    Table, Column, Model, HasMany, CreatedAt,
    UpdatedAt, DataType, Validate, DefaultScope, BelongsToMany
} from 'sequelize-typescript';
import { Request } from 'express';

export interface IKeyValue {
    Key: string;
    Value: string;
}

@Table
export default class KeyValue extends Model<KeyValue> implements IKeyValue {
    @Column({ primaryKey: true, type: DataType.STRING })
    Key: string;
    @Column({ type: DataType.STRING })
    Value: string;

    /**
     * @description Проверка полной модели пришедшей в запросе
     * @param req Объект запроса
     */
    static async checkFullModel(req: Request) {
        req.assert('Key', 'Key обязательно к заполнению').notEmpty();
        req.assert('Value', 'Value обязательно к заполнению').notEmpty();

        const errors = await req.getValidationResult();
        if (errors.isEmpty()) return null;
        return errors.array({onlyFirstError: true})[0];
    }
}