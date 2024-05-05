import mongoose from "mongoose"

const cartCollection = "cart";
const cartSchema = new mongoose.Schema(
    {
        products: Array,
    },
    {
        timestamps:true
    }
)

export const cartModel = mongoose.model(cartCollection,cartSchema);