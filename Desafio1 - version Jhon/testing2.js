const ProductManager2 = require("./productManager2");

const producto = new ProductManager2();


// console.log(producto.getProducts());
// console.log(producto.getProductById(1));
console.log(producto.addProduct("laptop","Lenovo 29", 5000, "https://img1.com", "s23h6",20));
console.log(producto.addProduct("laptop","hp 29", 5000, "https://img1.com", "s23h7",20));

console.log(producto.getProducts());
// console.log(producto.getProductById(1));