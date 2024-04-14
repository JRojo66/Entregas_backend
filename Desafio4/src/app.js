import express from "express";
import {engine} from "express-handlebars"
import __dirname from "./utils.js";
import { join } from "path";
import { router as productsRouter } from "./routes/productsRouter.js";
import { router as cartRouter } from "./routes/cartRouter.js";
import { router as viewsRouter } from "./routes/views.Router.js"
import { Server } from "socket.io";

const PORT = 8080;

const app = express();
let serverSocket

app.use(express.static(__dirname+'/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // allow to receive complex data from url

app.engine("handlebars",engine()); // Configures handlebars
app.set("view engine", "handlebars" );
app.set("views", __dirname+"/views");

app.use("/", viewsRouter);

app.use("/api/products", productsRouter); // directs /api/products to product router
app.use("/api/cart", cartRouter); // directs /api/cart to cartRouter

const serverHTTP = app.listen(PORT, () => console.log(`Server on line at port ${PORT}`));
//const io = new Server(serverHTTP);
serverSocket = new Server(serverHTTP);

serverSocket.on('connection', socket =>{
    console.log(`Client ${socket.id} connected`);    
    socket.emit("saludo", "Wellcome...! Identify yourself...");
    socket.on("id",nombre=>{
        console.log(`Customer  with id ${socket.id} has logged in as ${nombre}`);
        socket.broadcast.emit("nuevoUsuario",nombre); 
    });
    socket.on('nuevoMensaje',(nombre,mensaje)=>{
        serverSocket.emit("mensaje", nombre, mensaje)
    })
}); // end on connection

let temperatura=0;
setInterval(()=>{
    // fetch api clima
    temperatura = Math.floor(Math.random()*6+28);
    //console.log(temperatura);
    serverSocket.emit("nuevaLecturaNuevaTemperatura", temperatura)
}, 1000);
