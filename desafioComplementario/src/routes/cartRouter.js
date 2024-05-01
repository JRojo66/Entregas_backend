import { Router } from "express";
import __dirname from "../utils.js";
import {join} from "path";
import {CartManagerMONGO as CartManager}from "../dao/CartManagerMONGO.js";
import {ProductManagerMONGO as ProductManager}  from "../dao/ProductManagerMONGO.js";
import { cartModel } from "../dao/models/cartModel.js";
export const router = Router();



//Instanciates
const cartManager = new CartManager();
let arrayProducts = new ProductManager(join(__dirname,"data","products.json"));

//Loads cart
async function loadCartAndProducts() {
  await cartManager.init();
  await arrayProducts.init();
}
loadCartAndProducts();

// get cart
router.get("/", async(req, res) => {
  try {
    let cart=await cartManager.getCart()
   // if (req.query.limit) {
      // Check if 'limit' exists in the request query
      //const limit = Number(req.query.limit);
      //if (isNaN(limit)) {
        //return res.json({ error: "The 'limit' parameter must be a number" });
      //}
      //cart = cart.slice(0, limit); // Apply limit  if  valid
    //}
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

router.get("/:cid", (req, res) => {
  let cid = req.params.cid;
  cid = Number(cid);
  if (isNaN(cid)) {
    return res.json({ error: "Pls, enter a numeric id..." });
  }
  try {
    let cart = arrayCart.getCartById(cid);
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
  let firstCart = await arrayCart.addCart();  
  return res.json(firstCart);
  } catch {
    return res.json({ error: "Cannot create 1st cart" });
  }
});

// add cart if new - add product to cart if existing
router.post("/:cid/product/:id", async (req, res) => {    
  let cid = req.params.cid;
  cid = Number(cid);
  if(isNaN(cid)){
    return res.status(400).json({ error: `cart id must me a number` });
  }
  let id = req.params.id;
  id = Number(id);
  if(isNaN(id)){
    return res.status(400).json({ error: `product id must me a number` });
  }
  const product = await arrayProducts.getProductById(id);
  if (typeof product === "object") {
    let cart = await arrayCart.addProductInCart(cid, id);
    return res.json(cart);
  } else {
    return res.status(404).json({ error: `Product with ID ${id} not found` });
  }
});
