import { Router } from "express";
import __dirname from "../utils.js";
import { join } from "path";
import ProductManager from "../dao/ProductManager.js";
import validation from "../validation.js";
export const router = Router();

// Instanciates
let arrayProducts = new ProductManager(
  join(__dirname, "data", "products.json")
);  

// Loads Products
async function loadProducts() {
  await arrayProducts.init();
}
loadProducts();

// get products
router.get("/", (req, res) => {
  try {
    let products = arrayProducts.getProducts();
    if (req.query.limit) {
      // Check if 'limit' exists in the request query
      const limit = Number(req.query.limit);
      if (isNaN(limit)) {
        return res.json({ error: "The 'limit' parameter must be a number" });
      }
      products = products.slice(0, limit); // Apply limit if valid
    }
    return res.json(products);
  } catch {
    return res.json({ error: "Unknown error" }); // Handle any other errors
  }
});

// Request with Param id
router.get("/:id", (req, res) => {
  let id = req.params.id;
  id = Number(id);
  if (isNaN(id)) {
    return res.json({ error: "Pls, enter a numeric id..." });
  }
  try {
    let product = arrayProducts.getProductById(id); //products.find(p=>p.id===id);
    if (!product) {
      return res.json({ message: `id ${id} not found` });
    } else {
      res.json(product);
    }
  } catch {
    return res.json({ error: "Unkwown error params" });
  }
});

router.post("/", async (req, res) => {
  let { title, description, code, price, status, stock, category, thumbnails } =
    req.body;

  // Validation
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

  try {
    let newProduct = await arrayProducts.addProduct({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });
    
    req.serverSocket.emit("newProduct", title);
    
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(newProduct);
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: `${error.message}`,
    });
  }
});

router.put("/:id", async (req, res) => {
  let id = req.params.id;
  if (isNaN(id)) {
    return res.json({ error: "Pls, enter a numeric id..." });
  }
  let {title, description, code, price, status, stock, category, thumbnails} =
    req.body;
  const errors = validation(title, description, code, price, status, stock, category, thumbnails);
  if (errors.length > 0) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ errors }); // Return an array of validation errors
  }
  let updatedProduct = await arrayProducts.updateProduct(id, {title, description, code, price, status, stock, category, thumbnails});

  res.setHeader("Content-Type", "application/json");
  return res.status(200).json(updatedProduct);
});

router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  if (isNaN(id)) {
    return res.json({ error: "Pls, enter a numeric id..." });
  }

  let deletedProduct = await arrayProducts.deleteProductById(id);
  
  req.serverSocket.emit("newProduct", arrayProducts.getProducts());

  res.setHeader("Content-Type", "application/json");
  return res.status(200).json(deletedProduct);
});
