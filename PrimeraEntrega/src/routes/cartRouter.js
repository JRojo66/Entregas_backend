import { Router } from 'express';
import CartManager from '../dao/CartManager.js';
export const router=Router();

// Instanciates
let arrayCart = new CartManager("./src/data/cart.json");

// Loads Products
async function loadCart() {
  await arrayCart.init();
}
loadCart();

// get products
router.get("/", (req, res) => {
    try {
      let cart = arrayCart.getCart();
      if (req.query.limit) {
        // Check if 'limit' exists in the request query
        const limit = Number(req.query.limit);
        if (isNaN(limit)) {
          return res.json({ error: "The 'limit' parameter must be a number" });
        }
        cart = cart.slice(0, limit); // Apply limit if valid
      }
      return res.json(cart);
    } catch {
      return res.json({ error: "Unknown error" }); // Handle any other errors
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

  router.post("/:cid/product/:id", async (req,res) => {
    let cid = req.params.cid;
    cid = Number(cid);
    let id = req.params.id;
    id = Number(id);
    let cart = await arrayCart.addProductInCart(cid,id)
    return res.json(cart)
  });