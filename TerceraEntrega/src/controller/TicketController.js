import { ticketModel } from "../dao/models/ticketModel.js";
import { cartService } from "../services/CartService.js";
import { ticketService } from "../services/TicketService.js";
import { userService } from "../services/UserService.js";
import { productService } from "../services/ProductService.js";

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

      // Get cart, check every product's stock, create an array with available and an array with not available items
      let cart = await cartService.getCartBy({ _id: cid });
      let available = [];
      let notAvailable = [];
      let amount = 0;
      for (let i = 0; i < cart.products.length; i++) {     // ** Remember avoid using forEach with await inside - Doesn't work properly - methods do not await and generate problems
        let pid = cart.products[i].product._id;
        let product = await productService.getProductBy({ _id: pid });
        if (product.stock > cart.products[i].qty) {
          available.push({ product: pid, qty: cart.products[i].qty });
          amount = amount + product.price * cart.products[i].qty;
          // Discount from product stock
          product.stock = product.stock - cart.products[i].qty;
          await productService.updateProducts(pid, product);
        } else {
          notAvailable.push({ product: pid, qty: cart.products[i].qty });
        }
      }

      // Validate ticket not empty
      if (available.length > 0) {
        // Save ticket
        let newTicket = {
          code,
          amount,
          purchaser: userEmail,
          cart: cid,
          products: available,
        };
        await ticketService.addTicket(newTicket);

        // Upodate purchase_datetime with ticket's createdAt from timestamps
        let lastTicket = await ticketModel.findOne({ code });
        await ticketService.update(code, lastTicket.createdAt);

        // Update cart with unsold not sold products
        await cartService.updateCart(cid, {
          products: notAvailable,
        });
      } else {
        return res
          .status(404)
          .json({ error: `All products are out of stock...!!!` });
      }
      return res.status(201).json({
        message: `Ticket code: ${code} created...!!!`,
        notAvailable: notAvailable,
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
