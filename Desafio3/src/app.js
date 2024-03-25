const express = require("express");
const ProductManager = require("./classes/ProductManager");

const PORT = 3000;
const app = express();

app.use(express.urlencoded({ extended: true })); // allow to receive complex data from url

// Instanciates
let arrayProducts = new ProductManager();

// Loads Products
async function loadProducts() {
  await arrayProducts.init();
}
loadProducts();

// get products
app.get("/products", (req, res) => {
    try {
      let products = arrayProducts.getProducts();
      if (req.query.limit) { // Check if 'limit' exists in the request query
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
app.get("/products/:id", (req, res) => {
  let id = req.params.id;
  id = Number(id);
  if (isNaN(id)) {
    return res.json({ error: "Pls, enter a numeric id..." });
  }
  try {
    let product = arrayProducts.getProductById(id); //products.find(p=>p.id===id);
    if (!product) {
      return res.json({ message: `id ${id} not found` });
    }
    res.json(product);
  } catch {
    return res.json({ error: "Unkwown error params" });
  }
});

app.listen(PORT, () => console.log(`Server on line at port ${PORT}`));
