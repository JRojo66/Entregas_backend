import express from "express";
import { join } from "path";
import { router as productsRouter } from "./routes/productsRouter.js";
import { router as cartRouter } from "./routes/cartRouter.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // allow to receive complex data from url


app.use("/api/products", productsRouter)
app.use("/api/cart",cartRouter)

app.listen(PORT, () => console.log(`Server on line at port ${PORT}`));
