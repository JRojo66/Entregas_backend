const ProductManager = require("./classes/ProductManager");

// testing
// crea la instancia
let arrayProducts = new ProductManager();

// define la ruta al archivo
// console.log("Path");
// console.log(arrayProducts.getfilePath());

// Entorno de test - Llama a las funciones asincronas por orden

async function testEnvironment() {
  // Carga los productos en products
  await arrayProducts.init();
  // Test get products
  console.log("Test getProducts");
  await testGetProducts(); // prueba si cargó los productos en la variable products
  // Test addProduct
  await arrayProducts.addProduct(
    "producto prueba",
    "este es un producto prueba",
    200,
    "sin imagen",
    "abc123",
    25
  );
  await arrayProducts.addProduct(
    "producto prueba2",
    "este es un producto prueba2",
    200,
    "sin imagen",
    "abc124",
    25
  );
  await arrayProducts.addProduct(
    "producto prueba3",
    "este es un producto prueba3",
    200,
    "sin imagen",
    "abc125",
    25
  );
  await arrayProducts.addProduct(
    "producto prueba4",
    "este es un producto prueba4",
    204,
    "sin imagen4",
    "abc126",
    24
  );
  // Test get products after addProduct
  console.log("Test getProducts after addProduct");
  await testGetProducts(); // prueba si se agregaron los productos con addProduct
  // test producto con code repetido
  console.log("Test Repeated code");
  await arrayProducts.addProduct(
    "producto prueba",
    "este es un producto prueba",
    200,
    "sin imagen",
    "abc123",
    25
  );
  console.log("Products added after repeated code");
  console.log(arrayProducts.getProducts());
  // test updateProduct
  const productUpdateTest = {
    id: 30,
    title: "producto prueba30",
    description: "este es un producto prueba actualizado",
    price: 230,
    thumbnail: "sin imagen30",
  };
  console.log("Products after updating #4");
  await arrayProducts.updateProduct(4, productUpdateTest);
  console.log(arrayProducts.getProducts());
  // test updateProduct con id inexistente
  console.log("Products after trying to update #20");
  await arrayProducts.updateProduct(20, productUpdateTest);
  console.log(arrayProducts.getProducts());
  // test deleteProductById
  console.log("Borrar el producto con id 2");
  await arrayProducts.deleteProductById(2);
  console.log("Products after deleting id 2");
  console.log(arrayProducts.getProducts());
  // test deleteProductById con un producto inexistente
  console.log("Borrar el producto con id 22");
  await arrayProducts.deleteProductById(22);
  console.log("Products after trying to delete id 22");
  console.log(arrayProducts.getProducts());
  // test getProductById
  console.log("getProductsById (1)");
  console.log(await arrayProducts.getProductById(1));
  console.log("getProductsById (99) - unexistant Id");
  console.log(await arrayProducts.getProductById(99));
}
testEnvironment();

// test getProducts
async function testGetProducts() {
  console.log(await arrayProducts.getProducts());
}
