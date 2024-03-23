const express = require("express");
const ProductManager = require("./classes/ProductManager")

const PORT=3000;
const app=express();

let arrayProducts = new ProductManager();
// define la ruta al archivo
console.log("Path");
console.log(arrayProducts.getfilePath()); 

app.get("/products", (req,res)=>{
    let products=arrayProducts.getProducts()
    res.json(products);
})


app.listen(PORT, ()=>console.log(`Server on line at port ${PORT}`))
