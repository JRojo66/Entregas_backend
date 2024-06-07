// Imports
import fs from "fs";
import { stringify } from "querystring";
import { dirname, join } from "path";
import path from "path";
import { productsModel } from "./models/productsModel.js";

// Codigo
export class ProductManagerMONGO {
  #products;
  #filePath;
  // constructor(pathProducts) {                                                                                            // ** Borrar?
  //   this.#products = [];
  //   this.#filePath = pathProducts;
  // }
  async init() {
    this.#products = await this.getProducts();
  }

  // Mongo management

  // Read from DataBase

  async getProducts(){
    return await productsModel.find().lean();
  }

    async getProductsPaginate(query, limit, page, sort){
    return await productsModel.paginate(query, {limit, page, sort, lean: true})
  }
  
  // Read by Id from Database
  // getProductById = async (id) => {
  //   const product = await productsModel.find({id:id});
  //   if (product) {
  //     return product;
  //   } else {
  //     return `id ${id} not found...!`;
  //   }
  // };
  getProductsBy = async (filter) => {
    return await productsModel.findOne(filter).lean()
  }

  // Save in DataBase

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
    thumbnails = [], 
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
  // Delete
  async deleteProducts(productId) {
    return await productsModel.deleteOne({ _id: productId });
  }
  

  getfilePath = () => {
    return this.#filePath;
  };
}
