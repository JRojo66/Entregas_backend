const fs = require("fs");
const { stringify } = require("querystring");
// Codigo 
class ProductManager {
    #products;
    #filePath;
  constructor() {
    this.#filePath = "./files/products.json"
    this.#products = this.#getProductsFromFile();
  }

  // CRUD - Create, Read, Update, Delete
  // Create
  #getProductsFromFile = () => {
    try{
      if(fs.existsSync(this.#filePath)){
        return JSON.parse(fs.readFileSync(this.#filePath), {encoding: "utf-8"})
      } else {
      return [];
      }
    } catch(error) {
      console.log("Error reading file:  ",error);
    }
  }

  #saveProductsInFile(){
    try {
      fs.writeFileSync(this.#filePath, JSON.stringify(this.#products))
    } catch (error) {
      console.log("Error saving file:  ",error);
    }
  }

  addProduct = (title, description, price, thumbnail, code, stock) => {
      const existingProduct = this.#products.find(element => element.code === code);
    if (!existingProduct) {
      let id = 1;
      if(this.#products.length !== 0){
        id = this.#products[this.#products.length-1].id+1; // creates id = lastProduct.id +1
      }
      this.#products.push({id, title, description, price, thumbnail, code, stock});
      this.#saveProductsInFile();
      console.log("Product successfully added")
    } else {
      console.log(
        "Code " + code + " of " + title + " already exists"
      );
    }
  };
  //  Read all
  getProducts = () => {
    return this.#products;
  };
  // Read by Id
  getProductById = (id) => {
    const product = this.#products.find(element => element.id === id);
    if (product) {
      return product;
    } else {
      console.log("Not found");
    }
  };
// Update
updateProduct = (id, objectUpdate) => {
  const index = this.#products.findIndex(x => x.id === id);
  if(index >= 0){
    const {id, ...rest} = objectUpdate;
    this.#products[index] = {...this.#products[index],...rest};
    this.#saveProductsInFile();
    console.log("Producto "+id+" actualizado!");
  }
}

// Delete
deleteProductById = (id) => {
  const index = this.#products.findIndex(x => x.id === id);
  if(index >= 0){
    this.#products = this.#products.filter(x=> x.id !== id) ;
    this.#saveProductsInFile();
    console.log("Producto: "+id+" eliminado");
  } else {
    console.log("id: "+id+" not found ")
  }  
}

  getfilePath() {
    return this.#filePath;
  }
}



module.exports = ProductManager;
