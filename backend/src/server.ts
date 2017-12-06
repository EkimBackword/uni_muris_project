'use strict';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import expressValidator = require('express-validator');
import session = require('express-session');
import * as passport from 'passport';

import db from './db';
import { UserController } from './controllers/User.controller';
import { GroupController } from './controllers/Group.controller';
import { SubjectController } from './controllers/Subject.controller';

const cors = require('cors');
const cookieParser = require('cookie-parser');
const url = 'http://localhost';
const port = 35123;

/**
 * Create Express server.
 */
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cors({ credentials: true, origin: true }));
app.use(session({
    secret: 'keyboard_cat',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, expires : new Date(Date.now() + 3600000) }
}));
app.use(passport.initialize());
app.use(passport.session());
import './authentication';

new UserController(app);
new SubjectController(app);
new GroupController(app);

db.authenticate()
    .then(() => db.sync())
    .then(() => {
        /**
         * Start Express server.
         */
        app.listen(port, () => {
            console.log(('  App is running at http://localhost:%d'), port);
            console.log('  Press CTRL-C to stop\n');
        });
    });


module.exports = app;