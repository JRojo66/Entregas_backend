import { Router } from "express";
import fs from "fs"
import passport from "passport";
import {SessionsController} from "../controller/SessionsController.js" 
import { upload } from '../utils.js';

export const router = Router();

router.get("/premium/:uid", SessionsController.premium); 
router.post("/:uid/documents", upload.single("document"), SessionsController.addDocument)