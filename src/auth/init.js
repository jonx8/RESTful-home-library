const LocalStrategy = require('passport-local').Strategy

function initialize(passport, getUser, getUserById) {
    const authenticateUser = (username, password, done) => {
        const user = getUser(username);
        if (user == null) {
            return done(null, false, {message: 'Неправильное имя пользователя или пароль'});
        }

        if (user.password !== password) {
            return done(null, false, {message: 'Неправильное имя пользователя или пароль'});
        }
        return done(null, user);
    }

    passport.use(new LocalStrategy({}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => done(null, getUserById(id)));
}

module.exports = initialize;