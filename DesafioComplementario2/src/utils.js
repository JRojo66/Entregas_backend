import {fileURLToPath} from 'url';
import { dirname, join } from 'path';
import crypto from "crypto";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

//export default __dirname;

// System configuration
export const SECRET="CoderCoder123";
export const authMode="JWT"                    // Sessions or JWT




// export const generateHash = password => crypto.createHmac("sha256", SECRET).update(password).digest("hex")
export const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, passwordHash) => bcrypt.compareSync(password, passwordHash);

