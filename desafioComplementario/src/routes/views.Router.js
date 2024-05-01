import {Router} from 'express';
import {ProductManagerMONGO as ProductManager} from "../dao/ProductManagerMONGO.js";
import { dirname, join } from "path";
import __dirname from "../utils.js";

export const router=Router();

let productManager = new ProductManager(
    join(__dirname, "data", "products.json")
  );
  // Loads Products
async function loadProducts() {
    await productManager.init();
  }
  loadProducts();

  router.get('/products', async (req, res) => {
    try {
        let products = await productManager.getProducts();
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

router.get('/realtimeproducts', async (req, res) => {
    let rtproducts
    try {
        rtproducts= await productManager.getProducts();
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('realtime', {rtproducts});
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            }
        )
        
    }
});

export default router;
