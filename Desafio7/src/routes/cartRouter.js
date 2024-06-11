import { Router } from "express";
import { __dirname } from "../utils.js";
import { CartController } from "../controller/CartController.js";
export const router = Router();

router.get("/", CartController.getAllCarts);
router.get("/:cid", CartController.getCartById);
router.post("/:cid/product/:pid", CartController.addProductInCart);
router.put("/:cid", CartController.updateCart);
router.put("/:cid/products/:pid", CartController.updateQty);
router.delete("/:cid/product/:pid", CartController.deleteProduct);
router.delete("/:cid", CartController.deleteAllProductsInCart);
