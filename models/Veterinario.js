import mongoose from 'mongoose';
//npm install --save bcryptjs. Aquesta llibreria serveix per a hashejar la contrasenya.
import bcrypt from 'bcryptjs'; //Com que és una dependencia no cal el especificar el nom de l'arxiu amb el "".js"
import generarId from "../helpers/generarId.js";

//Definim l'estructura de dades que tindrà el model. // "trim" elimina els espais al davant i final.
const veterinarioSchema = new mongoose.Schema({
    nombre: {
       type: String,
       required: true,
       trim: true 
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

//El mètode "pre", ens permet alterar un camp de l'esquem de Moongose abans de que s'executi una acció predeterminada, en aquest cas, "save". Ens permet hashejar el password
veterinarioSchema.pre('save', async function (next) {  //Utilitzem "function()" i no "arrow function () =>", ja que el "this" funciona diferent en cada cas. En el "function()", el this es refereix a l'objecte actual. En canvi, en l'arrow function, el "this" es refereix a la finestra global

    if (!this.isModified("password")) {  //Comprovem que el password mai ha sigut canviat. Ja que si el tornem a hashejar, l'usuari no podrà accedir al site.
        next(); // El next, fa que directament és salti a la seguent funció del middleware. No sabem quina és, ja que no sabem la lògica que fa servir React. Simplement, estem dient que segueixi amb l'execució saltant-se aquesta funció.
    }

    // "this" conté l'objecte del model (bd)
    const salt = await bcrypt.genSalt(10); //"Salt" son rondes de codificació. L'standard és 10. És una funció asincrona ja que pot trigar una mica fer el hash. Depenent del servidor.
    this.password = await bcrypt.hash(this.password, salt);

});

//Mètode de "Veterinario" per a comprobar un passowrd donat amb l'encriptat de la bd.
veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password); //El mètode retorna un true o false.   //El mètode "compare ens permet comparar un password hasheshat amb un no hashejat."
}

const Veterinario = mongoose.model("Veterinario", veterinarioSchema);
export default Veterinario;