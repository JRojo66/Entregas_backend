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
    let limit = req.query.limit;
    let products = arrayProducts.getProducts();
    if (isNaN(limit)) {
      return res.json({ error: "Pls, enter a numeric id..." });
    }
    if (limit) {
      products = products.slice(0, limit);
    }
    return res.json(products);
  } catch {
    return res.json({ error: "Unkwown error limit" });
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
