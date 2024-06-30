import { Router } from 'express';
export const router=Router()
import HeroesManager from '../dao/HeroesManager.js'
import { CustomError } from '../utils/CustomError.js';
import { argumentosHeroe } from '../utils/erroresHeroes.js';
import { ERROR_TYPE } from '../utils/EErrors.js';

const heroesManager=new HeroesManager()

router.get('/',(req,res)=>{

    let heroes=heroesManager.getHeroes()

    res.status(200).json({heroes})
})

router.post('/',(req,res)=>{
    let {name}=req.body
    if(!name){
        console.log("argumentosHeroe(req.body); ",argumentosHeroe(req.body));
        // res.setHeader('Content-Type','application/json');
        // return res.status(400).json({error:`Complete al menos el name`})
        CustomError.createError("Argumento name faltante", argumentosHeroe(req.body), "Complete la propiedad name", ERROR_TYPE.INVALID_ARGUMENTS)
    }
});