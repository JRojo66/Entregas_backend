import mongoose from "mongoose"

const cartCollection = "cart";
const cartSchema = new mongoose.Schema(
    {
        products: String,

    },
    {
        timestamps:true
    }
)

export const cartModel = mongoose.model(cartCollection,cartSchema);