import { UserManagerMONGO as UserManager } from "../dao/UserManagerMONGO.js";
import { SECRET } from "../utils.js";
import jwt from "jsonwebtoken";
import { UserDTO } from "../dto/userDTO.js"

const userManager = new UserManager();

export class SessionsController {
  static redirectToMain = (req, res) => {
    res.redirect("http://localhost:8080/");
  };

  static register = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res.status(201).json({ message: "Register OK", newUser: req.user });
  };

  static login = async (req, res) => {
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
  };

  static loginJWT = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send("Enter email and password");
    let user = await userManager.getBy({ email });
    if (!user) return res.status(400).send(`Wrong credentials...!!!`);
    user = new UserDTO(user);
    user = { ...user };
    let token = jwt.sign(user, SECRET, { expiresIn: "1h" });
    res.cookie("codercookie", token, { httpOnly: true });
    return res.status(200).json({
      userLogged: user,
      token,
    });
  };

  static error = (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Unexpected server error - Try again later or contact admninistrator`,
      detail: `Authentication error...!!!`,
    });
  };

  static loginGitHub = (req, res) => {
    async (req, res) => {
      let { web } = req.body;
      let user = { ...req.user }; // passport modifies the request creating a req.user
      delete user.password;
      req.session.user = user;
      if (web) {
        res.redirect("/profile");
      } else {
        res.setHeader("Content-Type", "application/json");
        return res
          .status(200)
          .json({ payload: "Successful Login...!!!", user });
      }
    };
  };

  static callBackGitHub = (req, res) => {
    req.session.user = req.user;
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: req.user });
  };

  static logout = (req, res) => {
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
  };

  static current = (req, res) => {
    let userSessions = req.session.user;
    userSessions = new UserDTO(userSessions);
    if (!userSessions) {
      userSessions = "No sessions users logged";
    }
    let token = req.cookies["codercookie"];
    try {
      let userJWT = jwt.verify(token, SECRET);
      userJWT = new UserDTO(userJWT)
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ userSessions, userJWT });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(401).json({ userJWT: `${error}`, userSessions });
    }
  };
}
