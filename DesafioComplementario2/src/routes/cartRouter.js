import { Router } from "express";
import {__dirname} from "../utils.js";
import { join } from "path";
import { CartManagerMONGO as CartManager } from "../dao/CartManagerMONGO.js";
import { ProductManagerMONGO as ProductManager } from "../dao/ProductManagerMONGO.js";
import { auth } from "../middleware/auth.js";
import { isValidObjectId } from "mongoose";
import { cartModel } from "../dao/models/cartModel.js";
export const router = Router();

// Instanciates
const cartManager = new CartManager();
let productManager = new ProductManager(
  join(__dirname, "data", "products.json")
);

// Loads cart
async function loadCartAndProducts() {
  await cartManager.init();
  await productManager.init();
}
loadCartAndProducts();

// get all carts
router.get("/", async (req, res) => {
  try {
    let cart = await cartManager.getCart();
    if (req.query.limit) {
      // Check if 'limit' exists in the request query
      const limit = Number(req.query.limit);
      if (isNaN(limit)) {
        return res.json({ error: "The 'limit' parameter must be a number" });
      }
      cart = cart.slice(0, limit); // Apply limit  if  valid
    }
    return res.json(cart);
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Unexpected server error - Try again later or contact admninistrator`,
      detail: `${error.message}`,
    });
  }
});

// get cart by id
router.get("/:cid", async (req, res) => {
  let cid = req.params.cid;
  if (!isValidObjectId(cid)) {
    return res.json({ error: "Pls, enter a valid id..." });
  }
  try {
    let cart = await cartManager.getCartBy({ _id: cid });
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
  try {
    let firstCart = await cartManager.addCart();
    return res.json(firstCart);
  } catch {
    return res.json({ error: "Cannot create new cart" });
  }
});

// Update Products

router.post("/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params;
  if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Not valid cid/pid` });
  }

  let cart = await cartManager.getOneBy({ _id: cid });
  if (!cart) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Can't find Cart id ${cid}` });
  }

  let product = await productManager.getProductsBy({ _id: pid });
  if (!product) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Can't find product id ${pid}` });
  }

  let productIndex = cart.products.findIndex((p) => p.product == pid);

  if (productIndex === -1) {
    cart.products.push({ product: pid, qty: 1 });
  } else {
    cart.products[productIndex].qty++;
  }

  let result = await cartManager.updateProductsInCart(cid, cart);

  if (result.modifiedCount > 0) {
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: "Cart updated" });
  } else {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Unexpected server error - Try later or contact administrator`, // Error inesperado en el servidor - Intente más tarde, o contacte a su administrador
      detalle: `Could not update...!`,
    });
  }
});

// Update Cart
router.put("/:cid", async (req, res) => {
  // cid validations as ObjectId
  let { cid } = req.params;
  if (!isValidObjectId(cid)) {
    return res
      .status(500)
      .json({ error: `cart id must be a valid MongoDB _id` });
  }
  // cart validation
  let cartExists;
  cartExists = await cartManager.getCartBy({ _id: cid });
  if (!cartExists) {
    res.setHeader("Content-Type", "application/json");
    return res.status(404).json({ error: `There is no cart with id: ${cid}` });
  }
  // Cart update
  let newProducts = req.body;
  const newCart = await cartManager.updateProductsInCart(cid, newProducts);
  return res.json({ payload: `${newCart}` });
});

// Update qty in a product in cart
router.put("/:cid/products/:pid", async (req, res) => {
  // DANGER: the endpoint is very similar to "/:cid/product/:pid" and can be confused
  let { cid, pid } = req.params;
  // cid and pid validations as ObjectId
  if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
    return res
      .status(500)
      .json({ error: `cart and products id must be valid MongoDB _ids` });
  }
  // product validation
  let exists;
  try {
    exists = await productManager.getProductsBy({ _id: pid });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Unexpected server error - Try again later or contact admninistrator`,
      detail: `${error.message}`,
    });
  }
  if (!exists) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `There is no Product with id: ${pid}` });
  }
  //cart validation
  let cartExists;
  cartExists = await cartManager.getCartBy({ _id: cid });
  if (!cartExists) {
    res.setHeader("Content-Type", "application/json");
    return res.status(404).json({ error: `There is no cart with id: ${cid}` });
  }
  // Validate qty
  let newQty = req.body.qty;
  if (typeof newQty !== "number") {
    return res.status(500).json({ error: `qty must be a number` });
  }
  // Update qty
  try {
    let cart = await cartManager.getCartBy({ _id: cid }); // Seguir aca. No esta actualizando la cantidad en el carrito
    cart.products.forEach((product) => {
      if (product.id === pid) {
        product.qty = newQty;
      }
    });
    let newProducts = { products: cart.products };
    const newCart = await cartManager.updateProductsInCart(cid, newProducts);
    return res.json({ payload: `${newCart}` });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Unexpected server error - Try again later or contact admninistrator`,
      detail: `${error.message}`,
    });
  }
});

// Delete products in cart
router.delete("/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params; // create a validation function
  // cid and pid validations as ObjetcId
  if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
    return res
      .status(400)
      .json({ error: `cart and products id be valid Mongo ObjectIds` });
  }
  // product validation in products
  let existsInProducts;
  try {
    existsInProducts = await productManager.getProductsBy({ _id: pid });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Unexpected server error - Try again later or contact admninistrator`,
      detail: `${error.message}`,
    });
  }
  if (!existsInProducts) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(404)
      .json({ error: `There is no Product with id: ${pid}` });
  }
  // cart validation
  let cartExists;
  try {
    cartExists = await cartManager.getCartBy({ _id: cid });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Unexpected server error - Try again later or contact admninistrator`,
      detail: `${error.message}`,
    });
  }
  if (!cartExists) {
    res.setHeader("Content-Type", "application/json");
    return res.status(404).json({ error: `There is no cart with id: ${cid}` });
  }
  // product validation in cart
  let existsInCart;
  existsInCart = cartExists.products.some(
    (product) => typeof product.id === "string" && product.id === pid
  );
  if (!existsInCart) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(404)
      .json({ error: `There is no product ${pid} in cart ${cid}` });
  }
  // Delete product in cart
  try {
    let cartUpdated = await cartManager.deleteProducts(cid, pid);
    res.json({ payload: `${cartUpdated}` });
  } catch (error) {
    return res.json({
      error: `Unexpected server error - Try again later or contact admninistrator`,
      detail: `${error.message}`,
    });
  }
});

// Delete all products in cart

router.delete("/:cid", async (req, res) => {
  let { cid } = req.params;
  // cid validation as objectId
  if (!isValidObjectId(cid)) {
    return res
      .status(400)
      .json({ error: `cart id must be valid Mongo ObjectId` });
  }
  // cart validation

  let cartExists;
  try {
    cartExists = await cartManager.getCartBy({ _id: cid });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Unexpected server error - Try again later or contact admninistrator`,
      detail: `${error.message}`,
    });
  }
  if (!cartExists) {
    res.setHeader("Content-Type", "application/json");
    return res.status(404).json({ error: `There is no cart with id: ${cid}` });
  }

  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ payload: "OK" });
});
