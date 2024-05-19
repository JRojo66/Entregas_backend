import { Router } from "express";
import { UserManagerMONGO as UserManager } from "../dao/UserManagerMONGO.js";
import { validationUser, validationLogin } from "../validation.js";
import { generateHash, isValidPassword } from "../utils.js";
import passport from "passport";

export const router = Router();

const userManager = new UserManager();

//Route /
router.get("/", (req, res)=>{
  res.redirect("http://localhost:8080/")
})


// Route register
router.post("/register",passport.authenticate("register", {failureRedirect: "/api/sessions/error"}), async (req, res) => {
  // Retrieve data from body
  // let { name, lastName, email, age, password } = req.body;
  // // Validate datatype and empties
  // const errors = validationUser(name, lastName, email, age, password);
  // if (errors.length > 0) {
  //   res.setHeader("Content-Type", "application/json");
  //   return res.status(400).json({ errors });
  // }
  // // Validate existence
  // let exists;
  // try {
  //   exists = await userManager.getBy({ email });
  // } catch (error) {
  //   res.setHeader("Content-Type", "application/json");
  //   return res.status(500).json({
  //     error: `Unexpected server error - Try again later or contact admninistrator`,
  //     detail: `${error.message}`,
  //   });
  // }
  // if (exists) {
  //   res.setHeader("Content-Type", "application/json");
  //   return res.status(400).json({ error: `email ${email} already registered` });
  // }
  // password = generateHash(password);
  // // Add User
  // try {
  //   let newUser = await userManager.create({
  //     name,
  //     lastName,
  //     email,
  //     age,
  //     password,
  //   });
  //   delete newUser.password;
  //   res.setHeader("Content-Type", "application/json");
  //   return res
  //     .status(200)
  //     .json({ payload: "New user registered...!!!", newUser });
  // } catch (error) {
  //   res.setHeader("Content-Type", "application/json");
  //   return res.status(500).json({
  //     error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
  //     detail: `${error.message}`,
  //   });
  // }
res.setHeader('Content-Type','application/json');
return res.status(201).json({message:"Register OK", newUser: req.user});
});



// Route Login
router.post("/login",passport.authenticate("login", {failureRedirect: "/api/sessions/error"}) ,async (req, res) => {
  let {web} = req.body
  let user = { ...req.user };   // passport modifies the request creating a req.user
  delete user.password;
  console.log(user);
  req.session.user = user;
  if(web){
    res.redirect("/profile")
  }else{
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"Successful Login...!!!", user});
  }
});

// Route error at register or login
router.get("/error", (req,res)=>{
  res.setHeader('Content-Type','application/json');
  return res.status(500).json(
    {
      error:`Unexpected server error - Try again later or contact admninistrator`,
      detail: `Authentication error...!!!`,
    }
  )  
})

// Route logout
router.get("/logout", (req, res)=>{
  req.session.destroy(e=>{
      if(e){
          console.log(error);
          res.setHeader('Content-Type','application/json');
          return res.status(500).json(
              {
                  error:`Unexpected server error - Try again later or contact admninistrator`,
                  detalle:`${error.message}`
              }
          )
          
      }
  })
  res.setHeader('Content-Type','application/json');
  return res.status(200).json({payload:"Successful Logout...!!!"});
})