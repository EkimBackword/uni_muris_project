"use strict";

import * as express from 'express';
import * as bodyParser from 'body-parser';
import expressValidator = require("express-validator");
import session = require('express-session');
import * as passport from 'passport';
var cors = require('cors');
var cookieParser = require('cookie-parser');

import db from './db';
import { UserController } from './controllers/User.controller';

let url = 'http://localhost'
let port = 35123;

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
    cookie: { expires : new Date(Date.now() + 3600000) }
}))
app.use(passport.initialize())
app.use(passport.session())
import './authentication';


// app.use(async (req: express.Request, res, next) => {
//         if(req.method == "OPTION") return next();
//         if(req.path.match(/^\/user/) && req.path !== "/user/delete" && req.path !== "/user/list") return next();
    
//         let regEx = /Bearer (.+)/;
    
//         let group = regEx.exec(req.headers['authorization'].toString());
//         let token = group[1];
    
//         if(token) {
//             let serverToken = req.cookies.ServerToken
//             // let _user = await Token.Check(token, serverToken);
//             if(_user == null) return res.status(401).json({error: "Incorrect authorization"});
//             req.app.set('user', _user.toJSON());
//             return next();
//         } else {
//             return res.status(401).json({error: "Not authorization"});
//         }
// })
            
new UserController(app);

db.authenticate()
    .then(() => db.sync())
    .then(() => {
        /**
         * Start Express server.
         */
        app.listen(port, () => {
            console.log(("  App is running at http://localhost:%d"), port);
            console.log("  Press CTRL-C to stop\n");
        });
    })


module.exports = app;