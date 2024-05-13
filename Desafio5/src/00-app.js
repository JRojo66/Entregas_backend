import mongoose from "mongoose"
const app = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://backendCoderJRb:backend123@jr.rdtaukg.mongodb.net/?retryWrites=true&w=majority&appName=JR",
            {
                dbName:"clase16"
            }
          )
        console.log("DB conectada...!!!")
    } catch (error) {
        console.log("Error db:" + error.message)
    }


    const productsModel = mongoose.model(
        "products",
        new mongoose.Schema(
            {
                title: String,
                description: String,
                code: String,
                price: Number,
                status: Boolean,
                stock: Number,
                category: String,
                thumbnails: Array,
            },
            {
                timestamps:true
            }
        )
    )


    const cartSchema = new mongoose.Schema(
        {
            products: {   // products
                type: [
                    {
                        id: {    // product
                            type: mongoose.Types.ObjectId,
                            ref: "products"         // products (nombre del modelo de productos...)
                        },
                    }
                ]
            },
            qty: Number
        }
    )

    const cartModel = mongoose.model("cart", cartSchema)


    let cart = await cartModel.findOne()
        .populate("products.id")
        .lean()
        
    console.log("Consulta primer alumno con populate",JSON.stringify(cart, null, 5))

    const products = await productsModel.findOne();

    process.exit()

} // fin app()

app()