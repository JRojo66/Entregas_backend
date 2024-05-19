import passport from "passport";
import local from "passport-local";
import { UserManagerMONGO as UserManager} from "../dao/UserManagerMONGO.js";
import { generateHash, isValidPassword } from "../utils.js";

const userManager = new UserManager();

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
          let newUser = await userManager.create({
            name,
            lastName,
            email: username,
            age,
            password,
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
        async(username, password, done) => {
            try {
                // Validate existence
                let user = await userManager.getBy({email: username});
                if (!user) {
                    return done(null, false);                                                                                 
                }
                // Validate password
                if(!isValidPassword(password, user.password)){                    
                    return done(null, false)
                }
                return done(null, user);
            } catch (error) {
                return done(error); 
              }
        }
    )
  )
};

passport.serializeUser((user, done)=>{
    return done(null, user._id); 
})
passport.deserializeUser(async (id, done)=>{
    let user=await userManager.getBy({_id:id})
    return done(null, user)
})

