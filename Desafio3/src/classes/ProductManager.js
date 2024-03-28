// Imports
const fs = require("fs");
const { stringify } = require("querystring");
const {dirname, join}= require("path");
const path = require('path');

// Codigo
class ProductManager {
  #products;
  #filePath;
  constructor() {
    this.#products = [];
    this.  #filePath=join(path.join(path.dirname(__dirname), "files"), "products.json");
  }

  async init() {
    this.#products = await this.getProductsFromFileAsync();
  }

  // CRUD - Create, Read, Update, Delete
  // Create

  getProductsFromFileAsync = async () => {
    try {
      let fileContent = await fs.promises.readFile(this.#filePath, {
        encoding: "utf-8",
      });
      return JSON.parse(fileContent);
    } catch (error) {
      console.log("Error reading file: ", error);
      return []; // Return an empty array if reading fails
    }
  };

  #saveProductsInFileAsync = async () => {
    try {
      await fs.promises.writeFile(
        this.#filePath,
        JSON.stringify(this.#products)
      );
    } catch (error) {
      console.log("Error saving file:  ", error);
    }
  };

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    const existingProduct = this.#products.find(
      (element) => element.code === code
    );
    if (!existingProduct) {
      let id = 1;
      if (this.#products.length !== 0) {
        id = this.#products[this.#products.length - 1].id + 1; // creates id = lastProduct.id +1
      }
      this.#products.push({
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      });
      await this.#saveProductsInFileAsync();
      console.log("Product successfully added");
    } else {
      console.log("Code " + code + " of " + title + " already exists");
    }
  };
  //  Read all
  getProducts = () => {
    return this.#products;
  };
  // Read by Id
  getProductById = (id) => {
    const product = this.#products.find((element) => element.id === id);
    if (product) {
      return product;
    } else {
      console.log("Not found");
    }
  };
  // Update
  updateProduct = async (id, objectUpdate) => {
    const oldId = id;
    const index = this.#products.findIndex((x) => x.id === id);
    if (index >= 0) {
      const { id, ...rest } = objectUpdate;
      this.#products[index] = { ...this.#products[index], ...rest };
      await this.#saveProductsInFileAsync();
      console.log("Product " + oldId + " updated...!");
    } else {
      console.log("Product id " + oldId + " not found...!");
    }
  };

  // Delete
  deleteProductById = async (id) => {
    const index = this.#products.findIndex((x) => x.id === id);
    if (index >= 0) {
      this.#products = this.#products.filter((x) => x.id !== id);
      this.#saveProductsInFileAsync();
      console.log("Producto: " + id + " eliminado");
    } else {
      console.log("id: " + id + " not found ");
    }
  };

  getfilePath = () => {
    return this.#filePath;
  };
}

module.exports = ProductManager;
