import {Router} from 'express';
import ProductManager from "../dao/ProductManager.js";
import { dirname, join } from "path";
import __dirname from "../utils.js";

export const router=Router();

let arrayProducts = new ProductManager(
    join(__dirname, "data", "products.json")
  );
  // Loads Products
async function loadProducts() {
    await arrayProducts.init();
  }
  loadProducts();

  router.get('/products', async (req, res) => {
    try {
        let products = await arrayProducts.getProducts();
        let primerProducto = products[0];
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('home', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});

router.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('index', {});
});

export default router;
