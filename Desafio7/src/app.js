import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import sessions from "express-session";
import MongoStore from "connect-mongo";
import { Server } from "socket.io";
import {__dirname} from "./utils.js";
import { join } from "path";
import { router as productsRouter } from "./routes/productsRouter.js";
import { router as cartRouter } from "./routes/cartRouter.js";
import { router as viewsRouter } from "./routes/views.Router.js";
import { router as userRouter } from "./routes/userrouter.js";
import { router as sessionRouter } from "./routes/sessionRouter.js";
import passport from "passport";
import { initPassport } from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import { config } from './config/config.js';

const PORT = config.PORT;
const app = express();

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // allow to receive complex data from url
app.use(cookieParser());

app.engine("handlebars", engine()); // Configures handlebars
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(
  // Configures sessions
  sessions({
    secret: "config.SECRET",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      ttl: 3600,
      mongoUrl:
        config.MONGO_URL,
    }),
  })
);

initPassport(); // Configures passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/", viewsRouter);

app.use(
  "/api/products",
  (req, res, next) => {
    req.io = io;
    next();
  },
  productsRouter
);

app.use("/api/cart", cartRouter); // directs /api/cart to cartRouter
app.use("/api/sessions", sessionRouter);

const serverHTTP = app.listen(PORT, () =>
  console.log(`Server on line at port ${PORT}`)
);
//const io = new Server(serverHTTP);
export const io = new Server(serverHTTP);

const connDB = async () => {
  // Connects to mongoDb
  try {
    await mongoose.connect(
      config.MONGO_URL,
      {
        dbName: config.DB_NAME,
      }
    );
    console.log("DB Online...!!!");
  } catch (error) {
    console.log("Error al conectar a DB ", error.message);
  }
};
connDB();