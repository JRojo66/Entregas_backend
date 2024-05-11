import mongoose from "mongoose"

const cartCollection = "cart";
const cartSchema = new mongoose.Schema({
    products: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: 'products'
        }
      }
    ]
  });

export const cartModel = mongoose.model(cartCollection,cartSchema);
