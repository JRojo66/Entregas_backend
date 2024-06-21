import { Router } from "express";
import { ProductManagerMONGO as ProductManager } from "../dao/ProductManagerMONGO.js";
import { CartManagerMONGO as CartManager } from "../dao/CartManagerMONGO.js";
import { dirname, join } from "path";
import { __dirname } from "../utils.js";
import { auth } from "../middleware/auth.js";
import { ViewsController } from "../controller/ViewsController.js";

export const router = Router();                                                           

const cartManager = new CartManager();

router.get("/", ViewsController.home);
router.get("/createProduct", ViewsController.createProduct);
router.get("/products", ViewsController.products);
router.get("/realtimeproducts", ViewsController.realTimeProducts);
router.get("/cart/:cid", ViewsController.getCartById);
router.get("/register", ViewsController.register);
router.get("/login", ViewsController.login);
router.get("/loginJWT", ViewsController.loginJWT);
router.get("/login/github", ViewsController.loginGitHub);
router.get("/profile", auth, ViewsController.profile);
router.get("/logout", ViewsController.logout);

export default router;                                              // Uno de los dos exports esta de mas
