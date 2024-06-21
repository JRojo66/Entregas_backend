import {ticketModel} from "./models/ticketModel.js"

export class TicketManagerMONGO {
    add = async () => {
        const ticket = {}
        let newTicket = await ticketModel.create(ticket);
        return newTicket.toJSON();
      }
}