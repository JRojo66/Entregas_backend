import { Router } from "express";
import { UserManagerMONGO as UserManager } from "../dao/UserManagerMONGO.js";
import { validationUser, validationLogin } from "../validation.js";
import { generateHash, isValidPassword, SECRET } from "../utils.js";
import passport from "passport";
export const router = Router();
import jwt from "jsonwebtoken"                                                                                    // Pasar a sessions Router

const userManager = new UserManager();

//Route /
router.get("/", (req, res) => {
  res.redirect("http://localhost:8080/");
});

// Route register
router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/api/sessions/error" }),
  async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res.status(201).json({ message: "Register OK", newUser: req.user });
  }
);

// Route Login
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/api/sessions/error" }),
  async (req, res) => {
    let { web } = req.body;
    let user = { ...req.user }; // passport modifies the request creating a req.user
    delete user.password;
    req.session.user = user;
    if (web) {
      res.redirect("/profile");
    } else {
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ payload: "Successful Login...!!!", user });
    }
  }
);

router.post(
  "/loginjwt",
  async (req,res)=>{
    let {email, password}=req.body
    if(!email || !password) return res.status(400).send('Enter email and password')
    let user = await userManager.getBy({ email });
    if(!user) return res.status(400).send(`Wrong credentials...!!!`)
    user={...user}
    delete user.password
    let token=jwt.sign(user, SECRET, {expiresIn: "1h"})
    res.cookie("codercookie",token,{httpOnly: true})
    return res.status(200).json({
        userLogged:user,
        token
    })
  
  }
)

// Route error at register or login
router.get("/error", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(500).json({
    error: `Unexpected server error - Try again later or contact admninistrator`,
    detail: `Authentication error...!!!`,
  });
});

router.get('/login/github',passport.authenticate("github",{}),(req,res)=>{
  async (req, res) => {
    let { web } = req.body;
    let user = { ...req.user }; // passport modifies the request creating a req.user
    delete user.password;
    req.session.user = user;
    if (web) {
      res.redirect("/profile");
    } else {
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ payload: "Successful Login...!!!", user });
    }
  }
})
router.get('/callBackGithub',passport.authenticate("github",{failureRedirect:"/api/sessions/error"}),(req,res)=>{
  req.session.user = req.user;
  res.setHeader('Content-Type','application/json');
  return res.status(200).json({payload:req.user});
})

// Route logout
router.get("/logout", (req, res) => {
  req.session.destroy((e) => {
    if (e) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Unexpected server error - Try again later or contact admninistrator`,
        detalle: `${error.message}`,
      });
    }
  });
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ payload: "Successful Logout...!!!" });
});
