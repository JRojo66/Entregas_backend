import { Router } from "express";
import {__dirname } from "../utils.js";
export const router = Router();
import passport from "passport";
import { ProductController } from "../controller/ProductController.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

router.get('/',roleMiddleware(["admin","user"]),ProductController.getProducts); 
router.get("/:id",roleMiddleware(["admin","user"]),ProductController.getProductById); 
router.post("/", roleMiddleware(["admin"]),ProductController.createProduct); 
router.put("/:pid", roleMiddleware(["admin"]),ProductController.updateProduct); 
router.delete("/:pid", roleMiddleware(["admin"]),ProductController.deleteProduct); 

  

