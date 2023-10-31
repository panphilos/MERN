import express from "express"; //Afegim "type": "module" en el package.json per tal d'habilitar els "import" / "exports". Sinó, hem de fer servir un require.
import dotenv from 'dotenv';
import cors from "cors"; //Serveix per a protegir una app. Controlar que les dades només es puguin consumir des d'un altre servidor determinat
import conectarDB from './config/db.js';
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';


const app = express(); //Cridem a la funció d'express;
app.use(express.json()); //Afegim aquesta linea, per dir que enviarem dades en format JSON. Sense això, les requests POST en json, no es veuran.
dotenv.config(); //dotenv, escaneja l'arrel d'arxius buscant l'arxiu .env

conectarDB();

//Havent instalat i importat CORS, donem acces a la url del servidor des don es fan les peticions de frontend. Totes les peticions que no vinguin d'aquí, no estaran permeses
const doniminiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function(origin, callback) {
        if(doniminiosPermitidos.indexOf(origin) !== -1){
            //El origen del request está permitido
            callback(null, true);
        }else{
            callback(new Error('No permitido por CORS'))
        }
    }
}


//Hem de dir a Express que volem utilitzar el CORS
app.use(cors(corsOptions));

//Amb app.use montem el middleware de Express. Bàsicament estem dient que s'executi una funció en un path determinat.
//Guia interessant aquí: https://expressjs.com/es/guide/writing-middleware.html
app.use('/api/veterinarios',veterinarioRoutes);
app.use('/api/pacientes',pacienteRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {

    console.log(`Servidor funcionando en el puerto ${PORT}`);
})


//NODEMON
// Instal·lem Nodemon perque sinó, hem de reiniciar el servidor (ctrl+c > npm start) cada vegada que apliquem un canvi.
// Instal·lem nodem com a dependencia de desenvolupament, de manera que no aparegui quan fem un deploy a producció: 
// npm i --save-dev nodemon
// Afegim "dev" : "node index.js" en el package.json.
// Per executar l'script la pàgina a partir d'ara haurem d'escriure "npm run dev"


//CONECTEM A LA BD
// 1. Creem la carpeta config.
// 2. Instal·lem la dependencia mongoose.
// 3. "npm i mongoose"


//VARIABLES D'ENTORN
//Serveix per amagar la informació sensible que no vulguem mostrar quan pugem els nostres arxius, com ara les contrasenyes.
//Creem un arxiu ".env" i afegim la connexió a MongoDB.
//Li hem de dir a Express a on es troba la dependencia ".env", de manera que instalem un paquet per tal que ens permeti llegir aquests arxius.
// "npm i dotenv"
//importem la dependencia "dotenv" amb un import.
//Afegim la variable d'entorn "process.env.MONGO_URI" en l'arxiu de conexió "db.js"
// Afegim la linia de codi "const PORT = process.env.PORT || 4000". un cop fem el deploy a producció, el servidor que soporti NODE, asignarà un pot automaticament, mentrestant, se li asignarà el port 4000

//CREEM ELS MODELS
//Creem carpeta podels amb arxiu Veterinario.js.
// Afegim el data model, i exportem.

//ROUTING
// Creem carpeta routing.
// Afegim arxiu "veterinarioRoutes.js".
// Inicialzem el routing i l'exportem.
//Impotem el routing a index.js (aquí).


