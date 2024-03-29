const express = require("express");
const {join}= require("path")
const ProductManager = require(join(__dirname, "dao","ProductManager"));

const PORT =8080;
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true })); // allow to receive complex data from url

// Instanciates
let arrayProducts = new ProductManager();

// Loads Products
async function loadProducts() {
  await arrayProducts.init();
}
loadProducts();

app.put("/api/products/:id", async(req, res)=>{
  return res.status(200).json(req.body);
  });

  
app.listen(PORT, () => console.log(`Server on line at port ${PORT}`));