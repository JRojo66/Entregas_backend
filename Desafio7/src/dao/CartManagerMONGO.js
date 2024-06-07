// Imports
import fs from "fs";
import { stringify } from "querystring";
import { dirname, join } from "path";
import path from "path";
import { productsModel } from "./models/productsModel.js";
import { cartModel } from "./models/cartModel.js";



export class CartManagerMONGO {
  #cart;
  #filePathCart;
  constructor(pathCart) {
    this.#cart = [];
    this.#filePathCart = pathCart;
  }
  async init() {
    this.#cart = await this.getCart();
  }
  
  // Data Base management

  // Read from Data Base
  // get all carts  
  async getCart(){
    return await cartModel.find().lean();
  }
  // get cart with filter polulated
  getCartBy = async (filter) => {
    return await cartModel.findOne(filter).populate("products.product").lean()
  }

    // get cart with filter
    getOneBy = async (filter) => {
      return await cartModel.findOne(filter).lean()
    }

  // CRUD - Create, Read, Update, Delete

// Create cart
  addCart = async () => {
    const cartProducts = {products: []}
    let newCart = await cartModel.create(cartProducts);
    return newCart.toJSON();
  }

  // Create/add product in cart

  // async addProducts(cid, pid){                                                                                                
  //   let cart = await cartModel.findOne({_id:cid}); // finds cart cid
  //   console.log(cart);                                                                                                         // Borrar 
  //   if(cart){
  //     const product = cart.products.findIndex( // finds product pid
  //       (element) => element.id === pid
  //     );
  //     console.log(product);                                                                                                   // Borrar
  //     if(product>-1){
  //       try {
  //         await cartModel.findOneAndUpdate( // adds 1 to product
  //           { _id: cid, 'products.id': pid }, 
  //           { $inc: { 'products.$.qty': 1 } },
  //           { new: true } // Return updated document
  //         )
  //         return `Product ${pid} added to cart ${cid}`
  //       } catch (error) {
  //         return error;
  //       }
  //     } else {
  //       await cartModel.findOneAndUpdate({ _id: cart._id }, { $push: { products: {id: pid, qty: 1}}}) // Adds 1 product  pid to cart cid
  //       return `Product ${pid} added to cart ${cid}`
  //     }    
  //   }
  // }



// Upadate products in cart
async updateProductsInCart(id, cart){
        return await cartModel.updateOne({_id:id}, cart)
}

  // Delete product in cart
  async deleteProducts(cid, pid){
    let cart = await cartModel.findOne({_id:cid}); // finds cart cid
    if(cart){
      const product = cart.products.findIndex( // finds product pid
        (element) => element.id === pid
      );
      if(product>-1){
        cart.products = cart.products.filter(elemento => elemento.id !== pid)
        await cartModel.findOneAndUpdate(  
          { _id: cid },
          { $set: { products: cart.products } },
          { new: true }) 
          return `Product ${pid} deleted from cart ${cid}`
      }    
    }
  }

}


