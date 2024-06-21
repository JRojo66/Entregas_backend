import { ticketModel } from "../dao/models/ticketModel.js";
import { productsModel } from "../dao/models/productsModel.js"; 
import { cartService } from "../services/CartService.js";
import { userService } from "../services/UserService.js";
import { productService } from "../services/ProductService.js";

// **  Pasar a capas Service y DAO

export class TicketController {
  static createTicket = async (req, res) => {
    try {
      // Create unique code
      const code = new Date().getTime();

      // Get cart id from request params
      let { cid } = req.params;

      // Find cart´s user
      let user = await userService.getUsersBy({ cart: cid });
      if (!user) {
        return res.status(404).json({ error: `Cart ${cid} not found...!` });
      }
      const userEmail = user.email;

      // Get cart, check every product's stock, create an array with accepted items and an array with out of stock products
      let cart = await cartService.getCartBy({ _id: cid });
      let ticketCart = [];
      let ticketNotAvailable = [];
      let amount = 0;
      let lastTicket_id = "";
      for (let i = 0; i < cart.products.length; i++) {
        let cartProduct = cart.products[i].product._id;
        let product = await productService.getProductBy({ _id: cartProduct });
        let productStock = product.stock;
        let qty = cart.products[i].qty;
        let price = product.price;
        if (productStock > qty) {
          ticketCart.push({ product: cartProduct, qty: qty });
          amount = amount + price * qty;
          // Discount from product stock
          product.stock = productStock-qty;
            await productsModel.findByIdAndUpdate(cartProduct,product , {
              runValidators: true,
              returnDocument: "after",
            });                                                                                                                            // Pasar a TickeService
        } else {
          ticketNotAvailable.push({ product: cartProduct, qty: qty });
        }
      }

      // Validate ticket not empty
      if (ticketCart.length > 0) {
        // Save el ticket
        await ticketModel.create({
          code: code,
          amount: amount,
          purchaser: userEmail,
          cart: cid,
          products: ticketCart,
        });                                                                                                                           // Pasar a TicketService
        // Upodate purchase_datetime with ticket's createdAt from timestamps
        let lastTicket = await ticketModel.findOne({ code: code });                                                                   // Pasar a TicketService
        await ticketModel.findOneAndUpdate(
          // Pasar a TicketService
          { code },
          { $set: { purchase_datetime: lastTicket.createdAt } },
          { new: true }
        );
        // Update cart with unsold not sold products
        const updatedCart = await cartService.updateCart(cid, {
          products: ticketNotAvailable,
        });                                                                                                                           // Pasar a TicketService
      } else {
        return res
          .status(404)
          .json({ error: `All products are out of stock...!!!` });
      }
      return res
        .status(201)
        .json({
          message: `Ticket code: ${code} created...!!!`,
          notAvailable: ticketNotAvailable,
        });
    } catch (error) {
      return res.json({
        error:
          `Unexpected server error - Try again later or contact admninistrator` +
          error,
      });
    }
  };
}
