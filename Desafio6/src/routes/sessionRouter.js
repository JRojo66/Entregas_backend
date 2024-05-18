import { Router } from "express";
import { UserManagerMONGO as UserManager } from "../dao/UserManagerMONGO.js";
import { validationUser, validationLogin } from "../validation.js";
import { generateHash } from "../utils.js";

export const router = Router();

const userManager = new UserManager();

//Route /
router.get("/", (req, res)=>{
  res.redirect("http://localhost:8080/")
})


// Route register
router.post("/register", async (req, res) => {
  // Retrieve data from body
  let { name, lastName, email, age, password } = req.body;
  // Validate datatype and empties
  const errors = validationUser(name, lastName, email, age, password);
  if (errors.length > 0) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ errors });
  }
  // Validate existence
  let exists;
  try {
    exists = await userManager.getBy({ email });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Unexpected server error - Try again later or contact admninistrator`,
      detail: `${error.message}`,
    });
  }
  if (exists) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `email ${email} already registered` });
  }
  password = generateHash(password);
  // Add User
  try {
    let newUser = await userManager.create({
      name,
      lastName,
      email,
      age,
      password,
    });
    delete newUser.password;
    res.setHeader("Content-Type", "application/json");
    return res
      .status(200)
      .json({ payload: "New user registered...!!!", newUser });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detail: `${error.message}`,
    });
  }
});

// Route Login
router.post("/login", async (req, res) => {
  // Retrieve data from body

  let { email, password, web} = req.body;

  if(req.session.user){
    if(web){
      return res.redirect(`/login?error=You are already logged in...!!!`)
    }
  }

  // Validate datatype and empties
  const errors = validationLogin(email, password);
  if (errors.length > 0){
    if(web){
      return res.redirect(`/login?error=Invalid mail and/or password`)
    }else{
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ errors });
    }
    }
  // Validate existence
  let user;
  try {
    user = await userManager.getBy({ email, password: generateHash(password) });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Unexpected server error - Try again later or contact admninistrator`,
      detail: `${error.message}`,
    });
  }
  if (!user) {
    if(web){
      return res.redirect(`/login?error=Invalid Credentials`)
    } else{
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`Invalid Credentials`})
    }
  }
  user = { ...user };
  delete user.password;
  req.session.user = user;
  if(web){
    res.redirect("/products")
  } else{
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ payload: "Successful login", user });
  }
});

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