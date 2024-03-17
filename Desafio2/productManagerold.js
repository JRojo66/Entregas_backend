const fs = require("fs");
// Codigo
class ProductManager {
    #products;
    #filePath;
  constructor() {
    this.#products = [];
    this.#filePath = "./files/ProductFile.txt"
  }
  // Create
  addProduct = (title, description, price, thumbnail, code, stock) => {
    // * Leer archivo

    // * Guardar el contenido en products
      const existingProduct = this.#products.find(element => element.code === code);
    if (!existingProduct) {
      let id = this.#products.length + 1;
      this.#products.push({id, title, description, price, thumbnail, code, stock});
      console.log("Product successfully added")
      // * guardar products en el archivo
    } else {
      console.log(
        "Code " + code + " of " + title + " already exists"
      );
    }
  };
  //  Read all
  getProducts = () => {
    // * Leer el archivo
            fs.promises.readFile(this.#filePath, { encoding: "utf-8" })
            .then((read) => {
                console.log(read)
            })
            .catch(error => console.log(error.message))
    // * Guardar el contenido en products
    //return this.#products;
  };
  // Read by Id
  getProductById = (id) => {
    // * Leer el archivo
    // * Guardar el contenido en products
    const product = this.#products.find(element => element.id === id);
    if (product) {
      return product;
    } else {
      console.log("Not found");
    }
  };
// Update  
// * Metodo Update

// Delete
// *Metodo Delete

  getfilePath() {
    return this.#filePath;
  }
}


module.exports = ProductManager;
