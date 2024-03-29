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
      return this.#products
    } catch (error) {
      console.log("Error saving file:  ", error);
    }
  };

  addProduct = async ({title, description, code, price, status, stock, category, thumbnails}) => {
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
        status,
        category,
        thumbnails,
        code,
        stock,
      });
      await this.#saveProductsInFileAsync();
      return `Product ${id}: ${code} - ${title} saved...! `;
    } else {
      return `Code ${code} - ${title} already exists`;
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
      return `Product not found...!`
    }
  };
  // Update
  updateProduct = async (id, objectUpdate) => {
    const oldId = id;
    const index = this.#products.findIndex((x) => x.id === Number(id));
    if (index >= 0) {
      const existingProduct = this.#products.find((product) => product.code === objectUpdate.code);
      if(!existingProduct){
        const { id, ...rest } = objectUpdate;
        this.#products[index] = { ...this.#products[index], ...rest };
        await this.#saveProductsInFileAsync();
        return `Product ${oldId} updated...!`
      } else {
        return `Code ${objectUpdate.code} already exists...!`
      }
    } else {
      return `Pruduct id ${oldId} not found...!`
    }
  };

  // Delete
  deleteProductById = async (id) => {
    id = Number(id);
    const index = this.#products.findIndex((x) => x.id === id);
    if (index >= 0) {
      this.#products = this.#products.filter((x) => x.id !== id);
      this.#saveProductsInFileAsync();
      return `Product ${id} deleted...!`
    } else {
      console.log("id: " + id + " not found ");
    }
  };

  getfilePath = () => {
    return this.#filePath;
  };
}

module.exports = ProductManager;
