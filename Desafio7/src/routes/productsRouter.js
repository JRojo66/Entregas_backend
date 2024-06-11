import { Router } from "express";
import {__dirname } from "../utils.js";
export const router = Router();
import passport from "passport";
import { ProductController } from "../controller/ProductController.js";

router.get('/',ProductController.getProducts)
router.get("/:id",passport.authenticate("current", {session: false}), ProductController.getProductById); // Requiere login con jwt
router.post("/", ProductController.createProduct);
router.put("/:pid", ProductController.update);
router.delete("/:pid", ProductController.delete);