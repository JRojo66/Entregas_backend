import { fileURLToPath } from "url";
import { dirname, join } from "path";
//import crypto from "crypto";
import bcrypt from "bcrypt";
import winston from "winston";
import { config } from './config/config.js';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// System configuration
export const SECRET = "CoderCoder123"; // Sessions or JWT         TOMAR DE .ENV Y BORRAR

// export const generateHash = password => crypto.createHmac("sha256", SECRET).update(password).digest("hex")
export const generateHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, passwordHash) =>
  bcrypt.compareSync(password, passwordHash);


let customLevels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const customLoggerConsole = winston.createLogger({
  levels: customLevels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        // winston.format.colorize(
        //     {
        //         colors: {error: "bold white redBG", info: "blue", debug:"green"}
        //     }
        // ),
        winston.format.simple()
      ),
    }),
  ],
});

export const customLogger = winston.createLogger({
  levels: customLevels,
  transports: [
    new winston.transports.File({
      level: "info",
      filename: "./src/errors.log",
      format: winston.format.combine(winston.format.timestamp()),
    }),
  ],
});

if (config.RUN_MODE === "DEV") {
  customLogger.add(customLoggerConsole);
}

export const middLogger = (res, req, next) => {
  req.logger = customLogger;
  next();
};
