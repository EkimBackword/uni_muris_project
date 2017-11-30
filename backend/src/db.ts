import { Sequelize } from 'sequelize-typescript';

const db = new Sequelize({
    name: 'muris',
    username: 'test',
    password: 'test123',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    modelPaths: [__dirname + '/models']
});

export default db;