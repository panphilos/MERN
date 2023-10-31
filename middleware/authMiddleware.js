import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";


//A Postman, a "Obtener perfil" fem:
//1. En el camp "Type", seleccionen "Bearer Token"
//2. Afegim el token.
const checkAuth = async (req, res, next) => {  //Afegim next perque en alguns casos ens permetrà executar
    let token;                                //L'execució del middleware i passar-la al següent middleware.

    console.log(req.headers.authorization); //Ens retorna el token que enviem.
    req.test = 'This is just a test'; //Test, hem creat una variable global dins d'Express. 


    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        console.log('Si, tiene el token con bearer');
    
        try{
            token = req.headers.authorization.split(' ')[1]; //Treiem el "bearer" del token.        
            const decoded = jwt.verify(token, process.env.JWT_SECRET); //Per a verificar el token utilitzem la paraula secreta que tenim a .env. "decoded" retorna un objecte amb el id (la dada que li haviem passat al token anteriorment).
            
            //Ho afegim dins d'express, de manera que crei una sessió. i fiquem un next() per a que passi al seguent middleware sense que executi les següents linies. 
            req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado"); //treiem els pass, token i confirmado de la consula que sens retorna.
            return next(); //passem a executar el següent middleware.
        }catch(error) {
            const e = new Error('Token no Válido');
            return res.status(403).json({ msg: e.message });
        }
    }

    if(!token){
        const error = new Error('Token no Válido o inexistente');
        res.status(403).json({ msg: error.message });
    }

    return next();
};

export default checkAuth;