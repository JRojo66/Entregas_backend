import { Router } from "express";
import { UserManagerMONGO as UserManager } from "../dao/UserManagerMONGO.js";
import { validationUser, validationLogin } from "../validation.js";
import { generateHash, isValidPassword } from "../utils.js";
import passport from "passport";
export const router = Router();

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
      console.log(error);
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
