import { Router } from "express";
import __dirname from "../utils.js";
import {join} from "path";
import {CartManagerMONGO as CartManager}from "../dao/CartManagerMONGO.js";
import {ProductManagerMONGO as ProductManager}  from "../dao/ProductManagerMONGO.js";
import { isValidObjectId } from "mongoose";
export const router = Router();


//Instanciates
const cartManager = new CartManager();
let productManager = new ProductManager(join(__dirname,"data","products.json"));

//Loads cart
//async function loadCartAndProducts() {
  //await cartManager.init();
  //await productManager.init();
//}
//loadCartAndProducts();

// get cart
router.get("/", async(req, res) => {
  try {
    let cart=await cartManager.getCart()
   if (req.query.limit) {       // Check if 'limit' exists in the request query
      const limit = Number(req.query.limit);
      if (isNaN(limit)) {
        return res.json({ error: "The 'limit' parameter must be a number" });
      }
      cart = cart.slice(0, limit); // Apply limit  if  valid
    }
    return res.json(cart);
  } catch (error) {
    res.setHeader('Content-Type','application/json');
    return res.status(500).json(
        {
            error:`Unexpected server error - Try again later or contact admninistrator`,
            detail:`${error.message}`
        }
    )
  }
});

router.get("/:cid", (req, res) => { //** REVISAR - TRAE OBJETO VACIO*/
  let cid = req.params.cid;
  if (!isValidObjectId(cid)) {
    return res.json({ error: "Pls, enter a valid id..." });
  }
  try {
    let cart = cartManager.getCartById(cid);
    if (!cart) {
      return res.json({ message: `cart id ${cid} not found` });
    } else {
      res.json(cart);
    }
  } catch {
    return res.json({ error: "Unkwown error params" });
  }
});

// add 1st cart
router.post("/", async (req, res) => {    
  try{
  let firstCart = await cartManager.addCart();  
  return res.json(firstCart);
  } catch {
    return res.json({ error: "Cannot create 1st cart" });
  }
});

// add cart if new - add product to cart if existing
// router.post("/:cid/product/:id", async (req, res) => {    
//   let cid = req.params.cid;
//   if(!isValidObjectId(cid)){
//     return res.status(400).json({ error: `cart id must be a valid MongoDB _id` });
//   }
//   let id = req.params.id;
//   if(!isValidObjectId(id)){
//     return res.status(400).json({ error: `product id must be a valid MongoDB _id` });
//   }
//   const product = await productManager.getProductsBy({id});
//   if (typeof product === "object") {
//     let cart = await cartManager.addProductInCart(cid, id);
//     return res.json(cart);
//   } else {
//     return res.status(404).json({ error: `Product with ID ${id} not found` });
//   }
// });

router.post("/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params;
  if (!isValidObjectId(cid, pid)) {
    return res.status(400).json({
      error: `Enter a valid MongoDB id`,
    });
  }

  try {
    await cartManager.addProducts(cid, pid);
    let cartUpdated = await cartManager.getCartById(cid);
    res.json({ payload: cartUpdated });
  } catch (error) {
    res
      .status(300)
      .json({ error: `error when adding product ${pid} to cart ${cid}` });
  }
});