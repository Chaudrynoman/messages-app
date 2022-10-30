const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');
const logger = require('../logger/app.js');
try{
  function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
      const user = getUserByEmail(email)
      if (user == null) {
        return done(null, false, { message: 'No user with that email' })
      }
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      }
      else {
        return done(null, false, { message: 'Password incorrect' })
      }
    }
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
      return done(null, getUserById(id))
    })
  }
}
catch(err){
  logger.error(err);
}
module.exports = initialize
