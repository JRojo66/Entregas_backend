import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import passportJWT from "passport-jwt";
import { UserManagerMONGO as UserManager } from "../dao/UserManagerMONGO.js";
import { SECRET, generateHash, isValidPassword } from "../utils.js";
import { CartManagerMONGO as CartManager } from "../dao/CartManagerMONGO.js";

const userManager = new UserManager();
const cartManager = new CartManager();

const extractToken = (req) => {
  let token = null;
  if (req.cookies["codercookie"]) {
    token = req.cookies["codercookie"];
  }
  return token;
};

export const initPassport = () => {
  passport.use(
    "register",
    new local.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          let { name, lastName, age } = req.body;
          // Validate existence
          let exists = await userManager.getBy({ email: username });
          if (exists) {
            return done(null, false);
          }
          password = generateHash(password);
          // Add User
          let newCart = await cartManager.addCart();
          let newUser = await userManager.create({
            name,
            lastName,
            email: username,
            age,
            password,
            cart: newCart._id,
          });
          delete newUser.password;
          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new local.Strategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          // Validate existence
          let user = await userManager.getBy({ email: username });
          if (!user || !user.password) {
            return done(null, false);
          }
          // Validate password
          if (!isValidPassword(password, user.password)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: "Iv23lilw42OZu4xXKicA",
        clientSecret: "22bca2a20c3dda4b5b5b9ca2d19ac00275eb297b",
        callbackURL: "http://localhost:8080/api/sessions/callBackGithub",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let name = profile._json.name;
          let email = profile._json.email;
          if (!name || !email) {
            return done(null, false);
          }
          let user = await userManager.getBy({ email });
          if (!user) {
            let newCart = await cartManager.addCart();
            user = await userManager.create({
              name,
              email,
              profile,
              cart: newCart._id,
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "current",                                              // renombrar current para el desafio
    new passportJWT.Strategy(
      {
        secretOrKey: SECRET,
        jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([
          extractToken,
        ]),
      },
      async (tokenContent, done) => {        //a tokenContent se lo suele llamar usuario porque contiene datos del user
        try {
          return done(null, tokenContent);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  return done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
  let user = await userManager.getBy({ _id: id });
  return done(null, user);
});
