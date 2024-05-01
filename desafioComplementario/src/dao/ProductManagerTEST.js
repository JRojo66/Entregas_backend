// Imports
import fs from "fs";
import { stringify } from "querystring";
import { dirname, join } from "path";
import path from "path";
import { productsModel } from "./models/productsModel.js";


// Codigo
export class ProductManagerTEST {
  #products;
  #filePath;
  // constructor(pathProducts) { // ** Borrar cuando haya modificado view.router y otros que lo necesitan
  //   this.#products = [];
  //   this.#filePath = pathProducts;
  // }
  async init() {
    this.#products = await this.getProducts();
  }

  // File management

  // Read from DataBase

  async getProducts(){
    return await productsModel.find().lean();
  }
  
  // Read by Id from Database
  getProductById = async (id) => {
    const product = await productsModel.find({id:id});
    if (product) {
      return product;
    } else {
      return `id ${id} not found...!`;
    }
  };
  getProductsBy = async (filter) => {
    return await productsModel.findOne(filter)
  }

  // Save in DataBase

  #saveProducts = async () => {
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
  async addProducts({
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = [], // tambien pasar en el body de la request como array
  }) {
    let productAdded = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    await productsModel.create(productAdded);
  }

  async updateProducts(id, productData) {
    return await productsModel.findByIdAndUpdate(id, productData, {
      runValidators: true,
      returnDocument: "after",
    });
  }

  async deleteProducts(productId) {
    return await productsModel.deleteOne({ _id: productId });
  }
  

  getfilePath = () => {
    return this.#filePath;
  };
}
