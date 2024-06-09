// Imports
import { cartModel } from "./models/cartModel.js";


// Code
export class CartManagerMONGO {

  // CRUD - Create, Read, Update, Delete

  // Create: Carts are created with users

  // Read from Data Base

  // get all carts
   getAll = async () => {
    return await cartModel.find().lean();
  }

  // get cart with filter
  getOneBy = async (filter) => {  
    return await cartModel.findOne(filter).lean();
  };

  // get cart with filter polulated
  getBy = async (filter) => {
    return await cartModel.findOne(filter).populate("products.product").lean();
  };
  
  // Update products in cart
  updateProductsInCart = async (id, cart) => {
    return await cartModel.updateOne({ _id: id }, cart);
  }

  // Delete product in cart
  deleteProducts = async(cid, pid) => {
    return await cartModel.findByIdAndUpdate(cid,{$pull: { products: { product: pid } }},{ new: true });
  }

}

