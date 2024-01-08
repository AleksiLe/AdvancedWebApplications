const LocalStategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByUsername, getUserById) {
    const authenticateUser = async (username, password, done) => {
        try {
            const user = getUserByUsername(username)
            if (!user) {
                return done(null, false)
            }
            else {
                const match = await bcrypt.compare(password, user.password)
                if (match) {
                    return done(null, user)
                }
                else {
                    return done(null, false)
                }
            }
        } catch {
            return done(null, false/* , {message: 'Something went wrong'} */)
        }
    }

    passport.use(new LocalStategy(authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize;