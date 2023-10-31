import Veterinario from "../models/Veterinario.js"; //Importem el model Veterinario
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";


const registrar =  async (req , res) => {
    const {email, nombre} = req.body; //Fem un destructuring
   
   //Prevenir usuaris duplicats.
   const existeUsuario = await Veterinario.findOne({email}); //En Js en un objecte quan l'index i el valorson iguals, es pot deixar nomes un terme ex: "email" en comptes de "email : email"
   
   if(existeUsuario){
    console.log('EXISTE USUARIO');
    const error = new Error('Usuario ya registrado');
    return res.status(400).json({ msg: error.message }); //Parem l'execució amb un return, ja que sinó es quedaria executant la petició durant molta estona.
   } 

    try {
        const veterinario = new Veterinario(req.body); //nova instancia de Veterinario.  
        const veterinarioGuardado = await veterinario.save();

        //ENVIAR EMAIL AQUI
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });

        res.json(veterinarioGuardado);
    } catch (error){
        console.log(error);
    }
    
    //Sempre que s'envia alguna cosa des de Post, es recull en el "req.body".
    console.log(req.body);

    //const {email, password, nombre} = req.body; //Fem un destructuring
    
    // res.send('Desde API/VETERINARIOS');  Això ens mostra el text en el navegador.
}

const perfil = (req , res) => {

   //console.log(req.veterinario); //Mostrem la informació del veterinari. Està definit en l'arxiu authMiddelware.js
    
   const { veterinario } = req;

   res.json(veterinario);  //Mostrem la informació del veterinari un cop ha fet el checkAuth (revisar authMiddelware.js).
   res.json({ msg: "Mostrando perfil..." });
}


const confirmar = async (req, res) => {

    //Per a poder llegir el parametre dinàmic, necessitem una sintaxis especial
    console.log(req.params.token); //params et passa els parametres de la request. el ".token", equival als parametres de de la url que s'ha ficat en l'altre arxiu.
    
    const { token } = req.params;
    const usuarioConfirmar = await Veterinario.findOne({ token });

    if(!usuarioConfirmar){
        const error = new Error('Token no válido');
        return res.status(404).json({ msg: error.message });
    }
    //console.log('usuarioConfirmar');
    
    try { 
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        res.json({msg: " Usuario confirmado correctamente "});

    } catch (error) {
        console.log(error);
    }

}

const autenticar = async (req, res) => {

    const { email, password } = req.body;

    const usuario = await Veterinario.findOne({email}); // Retorna tota l'entrada en la BD associada al email

    //Comprobem si l'usuari existeix o no
    if(!usuario){
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg: 'El usuario no existe'});
    } 

    //Comprobem si l'usuari està confirmat o no
    if(!usuario.confirmado){
        console.log('El usuario no ha sido cofirmado');

        const error = new Error("El usuario no ha sido confirmado");
        return res.status(403).json({ msg: 'El usuario no ha sido confirmado' });
       //res.json({msg: 'La cuenta no ha sido confirmado'});
    }

    //Comprobem si el password fa match amb el que tenim en la BD
    if (await usuario.comprobarPassword(password)){ //Hem definit el mètode "comprobarPassword" en el mateix model de Veterinario.js. Compara el password que introdueix l'usuari amb el password hashejat que tenim en la BD
        res.json({ 
            token: generarJWT(usuario.id),
            _id: usuario.id        
        });

        
                
        console.log('Password correcto');
        //res.json({msg: 'El password es correcto'});
    } else {
        const error = new Error("El password es incorrecto");
        return res.status(403).json({msg: error.message});
        console.log('Password Incorrecto');
    }
}

//Comprobem que l'usuari existeix i generem el Token
const olvidePassword = async (req, res) => { 

    //res.render('olvidé password');
    const { email } = req.body;
    console.log(email);
    
    const existeVeterinario = await Veterinario.findOne({email});
    if(!existeVeterinario){
        const errorx = new Error("El usuario no existe");
        return res.status(400).json({msg: errorx.message}); //Per alguna raó no mostra el missatge.
    }

    try{
        existeVeterinario.token = generarId(); //Generem un token i l'afegim al camp id en l'objecte "existeVeterinario"
        await existeVeterinario.save(); //Tornem a guardar l'objecte en la base de dades.

        emailOlvidePassword({
            email, 
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        });

        res.json({ msg: "El correo existe. Hemos envido un email con las instrucciones"}); //Aquí en principi enviarem un correu a l'usuari amb un link on tingui el token.
    }catch (error){
        console.log(error);        
    }

};

//Representa que això, validaria a l'usuari que ha fet click en el link del seu correu que te el token.
const comprobarToken = async (req, res) => {

    const { token } = req.params;
    
    const tokenValido = await Veterinario.findOne({ token });
    if(tokenValido){
        res.json({ msg: 'token valido y el usuario existe'});
    }else{
        const error = new Error('Token no válido');
        return res.status(400).json({ msg: error.message });
    }
};

//Creem un nou endpoint pero amb la mateixa url que "comprobarToken", però usant POST
const nuevoPassword = async (req, res) => {

    const { token } = req.params; //Seguim llegint el token 
    const { password } = req.body; //Agafem el password que ha introduït l'usuari.

    const veterinario = await Veterinario.findOne({ token }); //Comprobem que hi ha token

    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try{
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({ msg: 'password modificado correctamente '});
        console.log(veterinario);
        
    }catch(error){
        console.log(error);
    }

};

const actualizarPerfil = async (req, res) => {

    const veterinario = await Veterinario.findById(req.params.id);

    console.log('veterinario', veterinario)

    if(!veterinario){
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message})
    }

    //Validem que el correu que es vol actualizar no estigui ja en la BD
    const { email } = req.body;

    if(veterinario.email != req.body.email){
        const existeEmail = await Veterinario.findOne({email})
            if(existeEmail){
                const error = new Error("Ese email ya está en uso");
                return res.status(400).json({msg: error.message});
                console.log('Email en uso');
            }
    }

    try{ //Actualitzem cada camp de l'objecte veterinario de la BD (veterinario.nombre) amb els valors de la request que s'ha enviat (req.body.nombre)
        veterinario.nombre = req.body.nombre || veterinario.nombre;  
        veterinario.email = req.body.email || veterinario.email;
        veterinario.web = req.body.web || veterinario.web;
        veterinario.telefono = req.body.telefono || veterinario.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado); //Amb la resposta que ens retorni el servidor, actualitzarem l'state d'Auth, per tenir-ho tot sincronitzat. 
        
    }catch(error){
        console.log(error)
    }

}

const actualizarPassword = async (req,res) => {

    const { id } = req.veterinario;
    const {pwd_actual, pwd_nuevo } = req.body;

    //Comprobem que el veterinari existeix
    const veterinario = await Veterinario.findById(id);
    if(!veterinario){
        const error = new Error("Hubo un error");
        return res.status(400).json({ msg : error.message });
    }

    //Comprobem el password del veterinari. "ComprbarPassword" és un mètodo del Model "Veterinario"
    if( await veterinario.comprobarPassword(pwd_actual)){
        console.log(' password correcto');

        veterinario.password = pwd_nuevo; //actualitzem el password
        await veterinario.save();  //guardem en la bd tot l'objecte de "veterinario" amb el password ja guardat
        res.json({msg: 'Password Almacenado correctamente'})

    }else{
        console.log('incorrecto');
        const error = new Error("El Password Actual es incorrecto");
        return res.status(400).json({ msg: error.message });

    }


}


export {
registrar,
perfil,
confirmar,
autenticar,
olvidePassword,
comprobarToken,
nuevoPassword,
actualizarPerfil,
actualizarPassword
}

