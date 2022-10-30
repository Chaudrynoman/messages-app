const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const {userSchema} = require('../model/user.js');
const logger = require('../logger/app.js');
try{
  passport.use(new GoogleStrategy({
    clientID: '85382356722-ptbj3r1rvs8kh415dpjub0qke7cokgo3.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:5000/protected",
    passReqToCallback: true,
  },async (request, accessToken, refreshToken, profile, done)=> {
    logger.info(profile.id);
    const user=await userSchema.find({email:profile.email}).exec();
    if(user.length>0){
      //already exist
    }
    else{
      const newuser=new userSchema({
        id: profile.id,
        name: profile.displayName,
        email: profile.email
      });
      newuser.save();
    }
    done(null, profile);
  }));
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
}
catch(err){
  logger.error(err);
}
