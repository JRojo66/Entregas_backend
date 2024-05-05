import express from "express";
import mongoose from "mongoose";
import {engine} from "express-handlebars"
import __dirname from "./utils.js";
import { join } from "path";
import { router as productsRouter } from "./routes/productsRouter.js";
import { router as cartRouter } from "./routes/cartRouter.js";
import { router as viewsRouter } from "./routes/views.Router.js";
import { router as usuariosRouter} from './routes/usuarios.router.js';
import { Server } from "socket.io";

const PORT = 8080;

const app = express();

app.use(express.static(__dirname+'/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // allow to receive complex data from url

app.engine("handlebars",engine()); // Configures handlebars
app.set("view engine", "handlebars" );
app.set("views", __dirname+"/views");

app.use("/", viewsRouter);

// app.use("/api/products", productsRouter); // directs /api/products to product router
app.use(
    "/api/products", 
    (req, res, next) => {
        req.io = io;
        next();
      },
    productsRouter
);

app.use("/api/cart", cartRouter); // directs /api/cart to cartRouter

app.use('/api/usuarios',usuariosRouter)

const serverHTTP = app.listen(PORT, () => console.log(`Server on line at port ${PORT}`));
//const io = new Server(serverHTTP);
export const io = new Server(serverHTTP);

const connDB = async() => {
  try {
await mongoose.connect(
  "mongodb+srv://backendCoderJRb:backend123@jr.rdtaukg.mongodb.net/?retryWrites=true&w=majority&appName=JR",
  {
      dbName:"ecommerce"
  }
)
console.log("DB Online...!!!")
  } catch (error) {
    console.log("Error al conectar a DB ", error.message);
  }
}
connDB();


