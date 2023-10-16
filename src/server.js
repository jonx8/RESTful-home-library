const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport')
const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const authRouter = require('./routes/auth');
const server = express();

server.use('/public', express.static("./public"));
server.set("view engine", "pug");
server.set("views", `./views`);

server.use(cookieParser());
server.use(express.urlencoded({extended: false}));
server.use(session({
    secret: 'keyboard key',
    resave: false,
    saveUninitialized: false
}));

server.use(passport.authenticate('session'));
server.use('/', authRouter);
server.use('/', indexRouter);
server.use('/books', booksRouter);

server.listen(3000, () => {
    console.log("Server has been started on port 3000...");
});

