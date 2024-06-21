import { Router } from "express";
import {__dirname } from "../utils.js";
export const router = Router();
import passport from "passport";
import { ProductController } from "../controller/ProductController.js";

router.get('/',ProductController.getProducts)

// jwt login and user or admin role required
router.get("/:id",passport.authenticate("current", {session: false}),   (req, res, next) => {
    if (req.user.role === "admin"||"user") {
      ProductController.getProductById(req, res, next);
    } else {
      res.status(403).json({ message: "admin or user role required." });
    }
  }); 

// jwt login and admin role required
router.post("/", passport.authenticate("current", {session: false}),   (req, res, next) => {
    if (req.user.role === "admin") {
      ProductController.createProduct(req, res, next);
    } else {
      res.status(403).json({ message: "admin role required." });
    }
  });

// jwt login and admin role required  
router.put("/:pid", passport.authenticate("current", {session: false}),   (req, res, next) => {
    if (req.user.role === "admin") {
      ProductController.update(req, res, next);
    } else {
      res.status(403).json({ message: "admin role required." });
    }
  });

// jwt login and admin role required
router.delete("/:pid", passport.authenticate("current", {session: false}),   (req, res, next) => {
    if (req.user.role === "admin") {
      ProductController.delete(req, res, next);
    } else {
      res.status(403).json({ message: "admin role required." });
    }
  });

