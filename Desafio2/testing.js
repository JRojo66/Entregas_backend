const ProductManager = require("./productManager");

// testing
let arrayProducts = new ProductManager();
console.log("Empty array");
console.log(arrayProducts.getProducts());
// test Productos agregados OK
console.log("Add products");
arrayProducts.addProduct("producto prueba", "este es un producto prueba", 200, "sin imagen", "abc123", 25);
arrayProducts.addProduct("producto prueba2", "este es un producto prueba2", 200, "sin imagen", "abc124", 25);
console.log(arrayProducts.getProducts());
// test producto con code repetido
console.log("Repeated code");
arrayProducts.addProduct("producto prueba", "este es un producto prueba", 200, "sin imagen", "abc123", 25);
console.log(arrayProducts.getProducts());
// test getProductById
console.log("getProductsById (1)");
console.log(arrayProducts.getProductById(1));
console.log("getProductsById (99) - unexistant Id");
console.log(arrayProducts.getProductById(99));