const passport = require('passport');
const {Strategy}=require('passport-facebook');//faceboo
const {userSchema} = require('../model/user.js');

passport.use(new Strategy({
    clientID: '512688677116478',
        clientSecret: 'd0214abbada50454882ce3b10e6a851f',
        callbackURL: 'http://localhost:5000/fb',
        profileFields: ['id', 'displayName']
}, async (accessToken, refreshToken, profile, done)=> {
    console.log(profile.id);
    const user=await userSchema.find({id:profile.id}).exec();
      if(user.length>0){
        //already exist
      }
      else{
        const newuser=new userSchema({
            id: profile.id,
            name: profile.displayName,
            email: profile.provider
          });
        newuser.save();
      }
    done(null, profile);
}
));

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });