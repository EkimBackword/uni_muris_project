import { Sequelize } from 'sequelize-typescript';

const db = new Sequelize({
    name: 'study-db',
    username: 'study-db',
    password: '224657',
    host: 'db2.itdubna.online',
    port: 5432,
    dialect: 'postgres',
    modelPaths: [__dirname + '/models']
});

export default db;
