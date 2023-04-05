/****************************************************************************** ***
* ITE5315 – Project
* I declare that this assignment is my own work in accordance with Humber Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source 
* (including web sites) or distributed to other students. 
*
* Group member Name: Amrendra Kumar Singh
                     Nishant Kumar
                     Frank Sandhu
*Student IDs: N01499580
              N01511158
              N01501035 
Date: April 5th 2023
********************************************************************************/
const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
const config = require("../.././config/config");
const users = require("../../models/user");

const strategy = new JWTStrategy(
  {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  },
  (payload, done) => {
    const user = users.find((u) => u.id === payload.id);
    if (user) {
      return done(null, user);
    } else {
      return done(new Error("User not found"), null);
    }
  }
);

passport.use(strategy);

module.exports = passport;
