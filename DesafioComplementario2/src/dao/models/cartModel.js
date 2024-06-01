import mongoose from "mongoose"

const cartCollection = "cart";
const cartSchema = new mongoose.Schema(
  {
      products: {   // products
          type: [
              {
                  product: {    // product
                      type: mongoose.Types.ObjectId,
                      ref: "products"         // products (nombre del modelo de productos...)
                  },
                  qty: Number
              }
          ]
      },
  }
)

export const cartModel = mongoose.model(cartCollection,cartSchema);
