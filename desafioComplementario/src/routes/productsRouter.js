import { Router } from "express";
import __dirname from "../utils.js";
import { join } from "path";
import {ProductManagerMONGO as ProductManager} from "../dao/ProductManagerMONGO.js";
//import {ProductManagerMEMORY as ProductManager} from "../dao/ProductManagerMEMORY.js";
import { io } from "../app.js";
import validation from "../validation.js";
import { productsModel } from "../dao/models/productsModel.js";
import { isValidObjectId } from "mongoose";
export const router = Router();


// Instanciates
let productManager = new ProductManager(
   join(__dirname, "data", "products.json") 
);

// Loads Products
async function loadProducts() {
  await productManager.init();
}
loadProducts();  

// get Products
router.get('/',async(req,res)=>{
  try {
      let products=await productManager.getProducts()
    if (req.query.limit) { //Checks if 'limit' exists in the request query
      const limit = Number(req.query.limit);
      if (isNaN(limit)) {
       return res.json({ error: "The 'limit' parameter must be a number" });
      }
      products = products.slice(0, limit); // Apply limit if valid
    }
      res.setHeader('Content-Type','application/json');
      return res.status(200).json({products});        
  } catch (error) {
      res.setHeader('Content-Type','application/json');
      return res.status(500).json(
          {
              error:`Unexpected server error - Try again later or contact admninistrator`,
              detail:`${error.message}`
          }
      )
  }
})

// Request with Param id
router.get("/:id", async(req, res) => {
  let id = req.params.id;
  id = Number(id);
  if (isNaN(id)) {
    return res.json({ error: "Pls, enter a numeric id..." });
  }
  try {
    let product = await productManager.getProductById(id); //products.find(p=>p.id===id);
    if (!product) {
      return res.json({ message: `id ${id} not found` });
    } else {
      res.json(product);
    }
  } catch {
    return res.json({ error: "Unkwown error params" });
  }
});

// Add product
router.post("/", async (req, res) => {
  let { title, description, code, price, status, stock, category, thumbnails } =
    req.body;

  const errors = validation(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  );
  if (errors.length > 0) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ errors }); // Return an array of validation errors
  }

  let exists;
  try {
    exists = await productManager.getProductsBy({ code });
  } catch (error) {
      res.setHeader('Content-Type','application/json');
  return res.status(500).json(
    {
      error:`Unexpected server error - Try again later or contact admninistrator`,
      detail:`${error.message}`
    }
  )
}
  if (exists) {
    return res
      .status(400)
      .json({ error: `Product with code ${code} already exists` });
  }
  try {
    await productManager.addProducts({ title, description, code, price, status, stock, category, thumbnails});
    let newProduct = await productManager.getProducts();
    req.io.emit("newProduct", title);;
    return res.json({ payload: `Product added` });
  } catch (error) {
    res.status(300).json({ error: `Unexpected server error - Try again later or contact admninistrator` });
  }
});



// Update
router.put("/:pid", async (req, res) => {
  let { pid } = req.params;
  if (!isValidObjectId(pid)) {
    return res.status(400).json({
      error: `Enter a valid id`,
    });
  }

  let updatedProduct = req.body;

  if (updatedProduct._id) {
    delete updatedProduct._id;
  }

  if (updatedProduct.code) {
    let exist;
    try {
      exist = await productManager.getProductsBy({ code: updatedProduct.code });
      if (exist) {
        return res.status(400).json({
          error: `A product with the code ${updatedProduct.code} already exists`,
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: `${error.message}`,
      });
    }
  }

  try {
    const products = await productManager.updateProducts(pid, updatedProduct);
    return res.json(products);
  } catch (error) {
    res.status(300).json({ error: `Unexpected server error - Try again later or contact admninistrator` });
  }
});


// Delete
router.delete("/:pid", async (req, res) => {
  let { pid } = req.params;
  if (!isValidObjectId(pid)) {
    return res.status(400).json({
      error: `Enter a valid id`,
    });
  }
  try {
    let products = await productManager.deleteProducts(pid);
    if (products.deletedCount > 0) {
      await productManager.getProducts();
      io.emit("deleteProducts", productManager.getProducts());
      return res.json({ payload: `Product ${pid} deleted` });
    } else {
      return res.status(404).json({ error: `${id} inexistent` });
    }
  } catch (error) {
    res.status(300).json({ error: `Error deleting product ${pid}` });
  }
});

