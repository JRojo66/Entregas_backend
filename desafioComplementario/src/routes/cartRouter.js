import { Router } from "express";
import __dirname from "../utils.js";
import {join} from "path";
import {CartManagerMONGO as CartManager}from "../dao/CartManagerMONGO.js";
import {ProductManagerMONGO as ProductManager}  from "../dao/ProductManagerMONGO.js";
import { isValidObjectId } from "mongoose";
export const router = Router();


// Instanciates
const cartManager = new CartManager();
let productManager = new ProductManager(join(__dirname,"data","products.json"));

// Loads cart
async function loadCartAndProducts() {
  await cartManager.init();
  await productManager.init();
}
loadCartAndProducts();

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

router.get("/:cid", async (req, res) => { 
  let cid = req.params.cid;
  if (!isValidObjectId(cid)) {
    return res.json({ error: "Pls, enter a valid id..." });
  }
  try {
    let cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.json({ message: `cart id ${cid} not found` });
    } else {
      res.json(cart);
    }
  } catch {
    return res.json({ error: "Unkwown error params" });
  }
});

// add new cart
router.post("/", async (req, res) => {    
  try{
  let firstCart = await cartManager.addCart();  
  return res.json(firstCart);
  } catch {
    return res.json({ error: "Cannot create new cart" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  let {cid,pid} = req.params;
  // cid and pid validations as ObjetcId
  if(!isValidObjectId(cid) || !isValidObjectId(pid)){
    return res.status(400).json({ error: `cart id must be a valid MongoDB _id` });
  }
  // product validation
  let exists;  
  try {
    exists = await productManager.getProductsBy({ _id:pid });
  } catch (error) {
      res.setHeader('Content-Type','application/json');
  return res.status(500).json(
    {
      error:`Unexpected server error - Try again later or contact admninistrator`,
      detail:`${error.message}`
    }
  )
}           
if (!exists){
  res.setHeader('Content-Type','application/json');
  return res.status(400).json({error:`There is no Product with id: ${pid}`})
}             
// Adds product in cart                                                                             
  try {
    let cartUpdated = await cartManager.addProducts(cid, pid); 
    res.json({ payload: `${cartUpdated}` });    
  } catch (error) {
    return res.json({
      error:`Unexpected server error - Try again later or contact admninistrator`,
      detail:`${error.message}`
    });
  }    
});





