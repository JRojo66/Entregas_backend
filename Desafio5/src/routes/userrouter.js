import { Router } from "express";
import { UserManagerMONGO as UserManager } from "../dao/UserManagerMONGO.js";
export const router=Router()

const usuariosManager=new UserManager()

router.get('/',async(req,res)=>{

    try {
        let users=await usuariosManager.getUser()
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({usuarios});        
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
        
    }

})

router.post('/',async(req, res)=>{
    let {nombre, email, apellido, password}=req.body
    if(!nombre || !email || !password){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Faltan datos: nombre, email y password son obligatorios...!!!`})
    }

    // let usuarios=usuariosManager.getUsuarios()
    // let existe=usuarios.find(u=>u.email===email) 
    let existe
    try {
        existe =await usuariosManager.getUserBy({email})
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
    }   

    if(existe){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`El usuario con email ${email} ya existe en BD...!!!`})
    }

    try {
        let nuevoUsuario=await usuariosManager.addUsuario({nombre, email, apellido, password:generaHash(password)})
        res.setHeader('Content-Type','application/json');
        return res.status(201).json({payload:nuevoUsuario});
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )  
    }

})