import { customLogger } from "../utils.js";

export class loggerTestController {
    static log = async (res, req) => {
          customLogger.fatal("loggerTest fatal");
          customLogger.error("loggerTest error");
          customLogger.warning("loggerTest warning");
          customLogger.info("loggerTest info");
          customLogger.http("loggerTest http");
          customLogger.debug("loggerTest debug");
          return res.status(200).json({payload:"errors logged"});
    }
}
