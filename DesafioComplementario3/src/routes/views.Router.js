import { Router } from "express";
import { CartManagerMONGO as CartManager } from "../dao/CartManagerMONGO.js";
import { __dirname } from "../utils.js";
import { authjwt } from "../middleware/auth.js";
import { auth } from "../middleware/auth.js";
import { ViewsController } from "../controller/ViewsController.js";
import passport from "passport";
import roleMiddleware from "../middleware/roleMiddleware.js";

export const router = Router();                                                           

const cartManager = new CartManager();

router.get('/',ViewsController.home); 
router.get("/createProduct",roleMiddleware(["admin"]), ViewsController.createProduct);
router.get("/products", roleMiddleware(["user"]),ViewsController.products);
router.get("/realtimeproducts", ViewsController.realTimeProducts);
router.get("/cart/:cid",roleMiddleware(["admin","user"]),ViewsController.getCartById);
router.get("/register", ViewsController.register);
router.get("/login", ViewsController.login);
router.get("/loginJWT", ViewsController.loginJWT);
router.get("/login/github", ViewsController.loginGitHub);
router.get("/passwordReset", ViewsController.passwordReset);
router.get("/passwordResetForm", ViewsController.passwordResetForm);
router.get("/profile", auth,roleMiddleware(["admin","user"]),ViewsController.profile);
router.get("/logout",roleMiddleware(["admin","user"]), ViewsController.logout);
router.get('/chat',roleMiddleware(["user"]),ViewsController.chat); 


export default router;
