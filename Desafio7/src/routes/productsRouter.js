import { Router } from "express";
import {__dirname } from "../utils.js";
import { join } from "path";
import {ProductManagerMONGO as ProductManager} from "../dao/ProductManagerMONGO.js";
//import {ProductManagerMEMORY as ProductManager} from "../dao/ProductManagerMEMORY.js";
import { io } from "../app.js";
import {validationProducts} from "../validation.js";
import { productsModel } from "../dao/models/productsModel.js";
import { isValidObjectId } from "mongoose";
export const router = Router();
import { authjwt } from "../middleware/auth.js";                             // Borrar
import passport from "passport";


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
  // Variables definition
  let pquery;
  let limit = 10;
  let page = 1;
  let query = {};
  let sort = {};
  let prevLink = "";
  let nextLink = "";

  // limit validation
  if (req.query.limit) {
    limit = Number(req.query.limit);
    if (isNaN(limit)) {
     return res.json({ error: "The 'limit' parameter must be a number" });
    }
  }

  // page validation
  if (req.query.page) {
    page = Number(req.query.page);
    if (isNaN(page)) {
     return res.json({ error: "The 'page' parameter must be a number" });
    }
  }

  // query validation
  if(req.query.query){
    let queryObject = {};
    try {
      queryObject = JSON.parse(req.query.query);
    } catch (error) {
      return res.json({ error: "Query param is not a JSON - please modify and try again" });
    }


    if (typeof queryObject === 'object'){                                                                                 // Validate query - Que mande alguna de la propiedades existentes
      query = queryObject;
    } else {
      return res.json({ error: "The 'query' parameter must be a JSON" });
    }
  }

  // sort validations
  if(req.query.sort){                                                                                                     // Validate sort - Que mande propiedades existentes
    let sortObject = {};
    try {
      sortObject = JSON.parse(req.query.sort);
    } catch (error) {
      return res.json({ error: "Sort param is not a JSON - please modify and try again" });
    }


    if (typeof sortObject === 'object'){                                                                    
      sort = sortObject;
    } else {
      return res.json({ error: "The 'sort' parameter must be a JSON" });
    }
  }

  // Query
  pquery = await productManager.getProductsPaginate(query, limit, page, sort)

  // Links to prevPage y nextPage
if(!pquery.hasPrevPage){
  prevLink = null;
} else {
    prevLink = `http://localhost:8080/api/products?page=${page - 1}&limit=${limit}&query=${encodeURIComponent(JSON.stringify(query))}&sort=${encodeURIComponent(JSON.stringify(sort))}`
}


if(!pquery.hasNextPage){                                                                                    
  nextLink = null;
  // console.log(nextLink);
} else {
    nextLink = `http://localhost:8080/api/products?page=${page + 1}&limit=${limit}&query=${encodeURIComponent(JSON.stringify(query))}&sort=${encodeURIComponent(JSON.stringify(sort))}`
}

  // Return
  res.setHeader('Content-Type','application/json');
  return res.status(200).json({status:200, payload:pquery.docs, totalPages: pquery.totalPages, prevPage: pquery.prevPage, nextPage: pquery.nextPage, hasPrevPage: pquery.hasPrevPage, hasNextPage: pquery.hasNextPage, prevLink, nextLink});
})


// Request with Param id
router.get("/:id",passport.authenticate("current", {session: false}), async(req, res) => {                               //Passport authenticate para DesafioComplementario2
  let id = req.params.id;
  id = Number(id);
  if (isNaN(id)) {
    return res.json({ error: "Pls, enter a numeric id..." });
  }
  try {
    let product = await productManager.getProductsBy({id:id}); 
    if (!product) {
      return res.json({ message: `id ${id} not found` });
    } else {
      res.json({product, user: req.user});                                                                               // Devuelve user para DesafioComplementario2

    }
  } catch {
    return res.json({ error: "Unkwown error params" });
  }
}); 

// Add product
router.post("/", async (req, res) => {
  let { title, description, code, price, status, stock, category, thumbnails } =
    req.body;

  const errors = validationProducts(
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