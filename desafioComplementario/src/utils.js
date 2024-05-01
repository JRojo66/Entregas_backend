import {fileURLToPath} from 'url';
import { dirname, join } from 'path';
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

const SECRET="CoderCoder123";
export const generateHash = password => {crypto.createHmac("sha256", SECRET).update(password).digest("hex")}

