import { Router } from "express";
import {loggerTestController} from "../controller/LoggerTestController.js"

export const router = Router();

router.get('/', loggerTestController.log); 