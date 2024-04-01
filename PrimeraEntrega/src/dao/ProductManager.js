// Imports
import fs from "fs";
import { stringify } from "querystring";
import { dirname, join } from "path";
import path from "path";

// Codigo
export default class ProductManager {
  #products;
  #filePath;
  constructor(pathProducts) {
    this.#products = [];
    this.#filePath = pathProducts;
  }
  async init() {
    this.#products = await this.getProductsFromFileAsync();
  }

  // File management

  // Read from file

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

  // Save in file

  #saveProductsInFileAsync = async () => {
    try {
      await fs.promises.writeFile(
        this.#filePath,
        JSON.stringify(this.#products)
      );
      return this.#products;
    } catch (error) {
      console.log("Error saving file:  ", error);
    }
  };

  // CRUD - Create, Read, Update, Delete
  // Create

  addProduct = async ({
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  }) => {
    const existingProduct = this.#products.find(
      (element) => element.code === code
    );
    if (!existingProduct) {
      let id = 1;
      if (this.#products.length !== 0) {
        id = Math.max(...this.#products.map((m) => m.id)) + 1; // creates id = max product.id +1
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
      return `id ${id} not found...!`;
    }
  };
  // Update
  updateProduct = async (id, objectUpdate) => {
    const oldId = id;
    const index = this.#products.findIndex((x) => x.id === Number(id));
    if (index >= 0) {
      const existingProduct = this.#products.find(
        (product) => product.code === objectUpdate.code
      );
      if (!existingProduct) {
        const { id, ...rest } = objectUpdate;
        this.#products[index] = { ...this.#products[index], ...rest };
        await this.#saveProductsInFileAsync();
        return `Product ${oldId} updated...!`;
      } else {
        return `Code ${objectUpdate.code} already exists...!`;
      }
    } else {
      return `Pruduct id ${oldId} not found...!`;
    }
  };

  // Delete
  deleteProductById = async (id) => {
    id = Number(id);
    const index = this.#products.findIndex((x) => x.id === id);
    if (index >= 0) {
      this.#products = this.#products.filter((x) => x.id !== id);
      this.#saveProductsInFileAsync();
      return `Product ${id} deleted...!`;
    } else {
      return `id ${id} not found`;
    }
  };

  getfilePath = () => {
    return this.#filePath;
  };
}
