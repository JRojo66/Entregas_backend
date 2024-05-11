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

    
    const cartModel = mongoose.model(
        "cart",                                                                         // Si no anda, cambiar por carts
        new mongoose.Schema({
            products: [
              {
                product: {
                  type: mongoose.Types.ObjectId,
                  ref: 'products'
                }
              }
            ]
          })
    )

   
    
    const docentesModelo = mongoose.model(
        "docentes",
        new mongoose.Schema(
            {
                nombre: String,
                titulo: String,
            },
            {
                timestamps: true
            }
        )
    )

    const cursosModelo = mongoose.model(
        "cursos",
        new mongoose.Schema(
            {
                nombre: String,
                horas: Number,
                docente: {
                    type: mongoose.Types.ObjectId, ref: "docentes"
                }
            },
            {
                timestamps: true
            }
        )
    )

    const alumnoEsquema = new mongoose.Schema(
        {
            nombre: String,
            email: String,
            cursando: {   // products
                type: [
                    {
                        curso: {    // product
                            type: mongoose.Types.ObjectId,
                            ref: "cursos"         // products (nombre del modelo de productos...)
                        },
                        // quantity: Number
                    }
                ]
            },
            aprobadas: {   // products
                type: [
                    {
                        curso: {    // product
                            type: mongoose.Types.ObjectId,
                            ref: "cursos"         // products (nombre del modelo de productos...)
                        },
                        // quantity: Number
                    }
                ]
            },

        }
    )

    const alumnosModelo = mongoose.model("alumnos", alumnoEsquema)

    // crear los datos:
    await docentesModelo.deleteMany()
    let docente01 = await docentesModelo.create({ nombre: "Marcos Aguirre", titulo: "Licenciado en Economía" })
    let docente02 = await docentesModelo.create({ nombre: "Paulina Gonzalez", titulo: "Analista de Sistemas" })

    await cursosModelo.deleteMany({})
    let curso01 = await cursosModelo.create({ nombre: "Calculo II", horas: 8, docente: docente01._id })
    let curso02 = await cursosModelo.create({ nombre: "Base de Datos I", horas: 3, docente: docente02._id })

    // console.log({ curso01, curso02 })

    await alumnosModelo.deleteMany()
    let alumno = await alumnosModelo.create({
        nombre: "Rafael Quiroga",
        email: "rafa@test.com",
        cursando: [{ curso: curso01._id }],
        aprobadas: [{ curso: curso02._id }],
    })





    // console.log(alumno)

    alumno = await alumnosModelo.findOne().lean()
    // console.log(alumno)



    // alumno=await alumnosModelo.findOne().populate("cursando.curso").lean()
    alumno = await alumnosModelo.findOne()
        .populate("cursando.curso")
        .lean()
        
    console.log("Consulta primer alumno con populate",JSON.stringify(alumno, null, 5))

    const products = await productsModel.findOne();
    //console.log("Consulta primer product",products);

    const cart = await cartModel.findOne().populate(products.product);
    console.log("cart ",cart);

    process.exit()

} // fin app()

app()