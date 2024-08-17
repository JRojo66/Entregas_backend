import { Router } from "express";
import passport from "passport";
import {SessionsController} from "../controller/SessionsController.js" 
import { upload } from '../utils.js';

export const router = Router();

router.get("/premium/:uid", SessionsController.premium); 
router.post("/:uid/documents",upload.single("document"), (req,res)=>{
    console.log(req.body);                                                                       // clg
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"File saved...!!!"});
})