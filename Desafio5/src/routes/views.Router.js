import {Router} from 'express';
import {ProductManagerMONGO as ProductManager} from "../dao/ProductManagerMONGO.js";
import { dirname, join } from "path";
import __dirname from "../utils.js";
import {auth} from "../middleware/auth.js"


export const router=Router();

let productManager = new ProductManager(
    join(__dirname, "data", "products.json")
  );
  // Loads Products
async function loadProducts() {
    await productManager.init();
  }
  loadProducts();

  // Home menu
  router.get('/', async (req, res) => {
      res.setHeader('Content-Type', 'text/html');
      res.status(200).render('index', {});
  });

  // Products view
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

// Realtime products view
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

// Register users view
router.get('/register', async (req, res) => {
    res.status(200).render('register')
})

// Users Login view
router.get('/login', async (req, res) => {
    res.status(200).render('login')
})

// 
router.get('/profile',auth, async (req, res) => {
    res.status(200).render('profile',{user: req.session.user})
    
})


// Export
export default router;
