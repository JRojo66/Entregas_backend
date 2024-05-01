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
  // constructor(pathCart) {
  //   this.#cart = [];
  //   this.#filePathCart = pathCart;
  // }
  // async init() {
  //   this.#cart = await this.getCart();
  //   console.log(this.#cart);
  // }
  
  // Data Base management
  // Read from Data Base

  // async getCart(){
  //  return await cartModel.find().lean(); 
  // }

  
  async getCart(){
    return await cartModel.find().lean();
  }

  // Read by Id
  getCartById = async (id) => {
    const cart = await cartModel.find({_id:id})
    console.log(cart)
    if (cart) {
      return cart;
    } else {
      return `cart id ${id} not found...!`;
    }
  };

  // Read form file
  #getCartFromFileAsync = async () => {
    try {
      let fileContent = await fs.promises.readFile(this.#filePathCart, {
        encoding: "utf-8",
      });
      return JSON.parse(fileContent);
    } catch (error) {
      return `Error reading file: , ${error}`;
    }
  };

  // Save in file

  #saveCartInFileAsync = async () => {
    try {
      await fs.promises.writeFile(
        this.#filePathCart,
        JSON.stringify(this.#cart)
      );
      return this.#cart;
    } catch (error) {
      return `Error saving file: ${error})`;
    }
  };

  // CRUD - Create, Read, Update, Delete

// Create cart
  addCart = async () => {
    const firstCart = {products: []}
    await cartModel.create(firstCart);
    return `Cart #1 created - Cart is empty`;
  }


  // Create/add product in cart
  async addProducts(idCart, idProduct) {
    try {
      let searchCart = await this.getCartById(idCart);
      let quantityValidation = searchCart.products.some(
        (p) => p.id == idProduct
      );

      if (quantityValidation) {
        let findProduct = searchCart.products.find((p) => p.id == idProduct);
        findProduct.quantity = findProduct.quantity + 1;
      } else {
        searchCart.products.push({ id: idProduct, quantity: 1 });
      }

      await searchCart.save();
    } catch (error) {
      console.error(error);
    }
  }
  
}

// const cart = this.#cart.findIndex((element) => element.id === cid); //Busca el cid en el Carrito
// if (cart > -1) {                                                    //Si existe, 
//   const product = this.#cart[cart].products.findIndex(              //Busca el la posicion del producto id en la posicion cid del carrito
//     (element) => element.id === id
//   );
//   if (product > -1) {                                               //Si el producto existe en la posicion cid
//     this.#cart[cart].products[product].qty++;                       // Aumenta la cantidad en uno,
//     await this.#saveCartInFileAsync();                              // guarda    
//     return `Product ${id} added to Cart # ${cid}!`;                 // y devuelve impresion que agrego el producto id en el cart cid
//   } else {                                                                                            // si el producto no existe en la posicion cid
//     let oldId = id;                                                                                   // guarda el id del producto    
//     id = Math.max(...this.#cart.map((m) => m.id)) + 1; // creates id = max cart.id +1                 // crea un id, pero creo que no se usa
//     let newProduct = { id: oldId, qty: 1 };                                                           // Crea un objeto con el id del producto y qty:1  
//     this.#cart[cart].products.push(newProduct);                                                       // agrega el objeto en la posicion cid del carrito
//     await this.#saveCartInFileAsync();                                                                // guarda  
//     return `Product ${oldId} added to Cart...! id: ${cid}`;                                           // devuelve impresion que agrego el producto id en la posicion cid
//   }
// } else {                                                                                              // si no existe el cid en el carrito
//   cid = Math.max(...this.#cart.map((m) => m.id)) + 1; // creates id = max cart.id +1                  // crea un cid
//   if(this.#cart.length===0){                                                                          // Si el carrito esta vacio
//     cid = 1;                                                                                            // Crea un cid = 1    
//     console.log(cid);                   
//   } 
//   this.#cart.push({ id: cid, products: [{ id: id, qty: 1 }] });                                       // Agrega un registo con el cid, y products[id:id, qty:1]
//   await this.#saveCartInFileAsync();                                                                  // Guarda
//   return `New Cart added...! Cart id:  ${cid}...!`;                                                   // devuelve impresion que agrego un carrito
  
// }