import { fileURLToPath } from "url";
import { dirname, join } from "path";
//import crypto from "crypto";
import bcrypt from "bcrypt";
import winston from "winston";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// System configuration
export const SECRET = "CoderCoder123"; // Sessions or JWT         TOMAR DE .ENV Y BORRAR

// export const generateHash = password => crypto.createHmac("sha256", SECRET).update(password).digest("hex")
export const generateHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, passwordHash) =>
  bcrypt.compareSync(password, passwordHash);

const transporteArchivoError = new winston.transports.File({
  level: "warn",
  filename: "./src/errorLogs.log",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

const filtroDebug = winston.format((data) => {
  // console.log(data)
  if (data.level === "debug") {
    data.message = data.message.toUpperCase();
    return data;
  }
});

const transporteArchivoDebug = new winston.transports.File({
  level: "debug",
  filename: "./src/debugLogs.log",
  format: winston.format.combine(
    filtroDebug(),
    winston.format.timestamp(),
    winston.format.json()
  ),
});

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "http",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple()
        //winston.format.json()
      ),
    }),
    transporteArchivoError,
  ],
});


let debug = true; // tomarlo de los argumentos por consola, o de la variables de entorno
if (debug == true) {
  logger.add(transporteArchivoDebug);
}

let customLevels = {
    grave: 0,
    medio: 1,
    leve: 2
}

const loggerPersonalizadoConsole = winston.createLogger(
    {
        levels: customLevels,
        transports: [
            new winston.transports.Console(
                {
                    level: "leve",
                    format: winston.format.combine(
                        winston.format.colorize(
                            {
                                colors: {grave: "bold white redBG", medio: "blue", leve:"green"}
                            }
                        ),
                        winston.format.simple(),
                    )

                }
            )
        ]
    }
)


const loggerPersonalizado = winston.createLogger(
    {
        levels: customLevels,
        transports: [
            new winston.transports.File(
                {
                    level: "leve",
                    filename: "./src/erroresGraves.log",
                    format: winston.format.combine(
                        winston.format.timestamp(),
                    )

                }
            )
        ]
    }
)

if(debug === true){
    loggerPersonalizado.add(loggerPersonalizadoConsole)
}

export const middLogger = (res, req, next) => {
  req.logger = logger;
  req.logger2 = loggerPersonalizado;
  next();
};