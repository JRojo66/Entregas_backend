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
  
  async getCart(){
    return await cartModel.find().lean();
  }

  // Read by Id
  // getCartById = async (cid) => {
  //   const cart = await cartModel.find({_id:cid})
  //   console.log("cart in cartmanager", cart);
  //   if (cart) {
  //     return cart;
  //   } else {
  //     return `cart id ${cid} not found...!`;
  //   }
  // };

  getCartBy = async (filter) => {
    return await cartModel.findOne(filter)
  }

  // CRUD - Create, Read, Update, Delete

// Create cart
  addCart = async () => {
    const newCart = {products: []}
    await cartModel.create(newCart);
    return `New Cart created - Cart is empty`;
  }

  // Create/add product in cart

  async addProducts(cid, pid){                                                                                                // ** Pasar las validaciones al router
    let cart = await cartModel.findOne({_id:cid}); // finds cart cid
    if(cart){
      const product = cart.products.findIndex( // finds product pid
        (element) => element.id === pid
      );
      if(product>-1){
        try {
          await cartModel.findOneAndUpdate( // adds 1 to product
            { _id: cid, 'products.id': pid }, 
            { $inc: { 'products.$.qty': 1 } },
            { new: true } // Return updated document
          )
          return `Product ${pid} added to cart ${cid}`
        } catch (error) {
          return error;
        }
      } else {
        await cartModel.findOneAndUpdate({ _id: cart._id }, { $push: { products: {id: pid, qty: 1}}}) // Adds 1 product  pid to cart cid
        return `Product ${pid} added to cart ${cid}`
      }    
    }
  }

// Upadate products in cart
async updateProductsInCart(cid, updatedProducts){
  try {
    await cartModel.findByIdAndUpdate(cid, updatedProducts, { new: true })                                  
    return `Cart ${cid} updated with ${JSON.stringify(updatedProducts)}`    
  } catch (error) {
    return error;
  }
}

// Update qty in cart




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


