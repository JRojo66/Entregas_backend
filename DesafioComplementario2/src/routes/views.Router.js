import {Router} from 'express';
import {ProductManagerMONGO as ProductManager} from "../dao/ProductManagerMONGO.js";
import { CartManagerMONGO as CartManager } from '../dao/CartManagerMONGO.js';
import { dirname, join } from "path";
import {__dirname} from "../utils.js";
import {auth} from "../middleware/auth.js"


export const router=Router();

// Instanciates ProductManager and CartManager
let productManager = new ProductManager(
    join(__dirname, "data", "products.json")
  );
  const cartManager=new CartManager()

  // Loads Products
async function loadProducts() {
    await productManager.init();
  }
  loadProducts();

  //Home menu
  router.get('/', async (req, res) => {
      res.setHeader('Content-Type', 'text/html');
      res.status(200).render('home', {});                                                      
  });

// Create products
// Register users view
router.get('/createProduct', async (req, res) => {
    res.status(200).render('createProduct')
})


  // Products view
  router.get('/products', async (req, res) => {
    try {
        let query = {};
        let page = 1;           // page by default
        let limit = 2;          // limit by default
        let sort = {price:-1}   // sort by default    
        if(req.query.page){
            page=req.query.page;
        }
        let user=req.session.user;
        let products = await productManager.getProductsPaginate(query, limit, page, sort);
        let cartId = user.cart                                                                        // Borrar
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('products', {products, user, cartId});
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

// Cart view
router.get("/cart/:cid", async(req, res)=>{
    let {cid}=req.params
    let user=req.session.user;
    let cart=await cartManager.getCartBy({_id:cid})
    res.setHeader('Content-Type','text/html');
    return res.status(200).render("cart", {cart, user});
})

// Register users view
router.get('/register', async (req, res) => {
    res.status(200).render('register')
})

// Users Login view
router.get('/login', async (req, res) => {
    let {error} = req.query
    res.status(200).render('login',{error})
})

// Users Login view
router.get('/login/github', async (req, res) => {
    let {error} = req.query
    res.status(200).render('loginGitHub',{error})
})

// Users profile view
router.get('/profile',auth, async (req, res) => {
        res.status(200).render('profile',{user: req.session.user})
})

// Logout view
router.get('/logout', async (req, res) => {
    req.session.destroy(e=>{
        if(e){
            console.log(error);
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Unexpected server error - Try again later or contact admninistrator`,
                    detalle:`${error.message}`
                }
            )
            
        }
    })
    res.status(200).render('logout')
    
})


// Export
export default router;
