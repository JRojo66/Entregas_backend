const ProductManager = require("./productManager");

// testing
// crea la instancia
let arrayProducts = new ProductManager();

// define la ruta al archivo
// console.log("Path");
// console.log(arrayProducts.getfilePath()); 

// test Productos agregados OK
// console.log("Add products");
// arrayProducts.addProduct("producto prueba", "este es un producto prueba", 200, "sin imagen", "abc123", 25);
// arrayProducts.addProduct("producto prueba2", "este es un producto prueba2", 200, "sin imagen", "abc124", 25);
// arrayProducts.addProduct("producto prueba3", "este es un producto prueba3", 200, "sin imagen", "abc125", 25);
// arrayProducts.addProduct("producto prueba4", "este es un producto prueba4", 204, "sin imagen4", "abc126", 24);
// console.log(arrayProducts.getProducts());

// test producto con code repetido
// console.log("Repeated code");
// arrayProducts.addProduct("producto prueba", "este es un producto prueba", 200, "sin imagen", "abc123", 25);
// console.log(arrayProducts.getProducts());

// test getProducts
// console.log("Productos");
// console.log(arrayProducts.getProducts());

// test getProductById
// console.log("getProductsById (1)");
// console.log(arrayProducts.getProductById(1));
// console.log("getProductsById (99) - unexistant Id");
// console.log(arrayProducts.getProductById(99));

// test deleteProductById
// console.log("Borrar el producto con id 2");
// arrayProducts.deleteProductById(2)
// console.log(arrayProducts.getProducts());
// // test deleteProductById con un producto inexistente
// console.log("Borrar el producto con id 22");
// arrayProducts.deleteProductById(22)
// console.log(arrayProducts.getProducts());

// test updateProduct
const productUpdateTest  = 
{
    id: 30,
    title: "producto prueba30",
    description: "este es un producto prueba30",
    price: 230,
    thumbnail: "sin imagen30",
  };

  arrayProducts.updateProduct(4, productUpdateTest);
