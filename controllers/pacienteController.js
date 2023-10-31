import Paciente from "../models/Paciente.js";

const agregarPaciente = async ( req, res ) => { 
    const paciente = new Paciente(req.body); //Creem nova instancia de la BD
    paciente.veterinario = req.veterinario._id; // req.veterinario és una variable global d'express que definim en fer el auth (authMiddleware) i que conté la informació del pacient. És accessible des de tot arreu.

    console.log('req.veterinario: '+req.veterinario);

    try{
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    }catch(error){
        console.log(error);
    }

    //console.log(paciente);
}

const obtenerPacientes = async ( req, res ) =>{ 
    const pacientes = await Paciente.find().where("veterinario").equals(req.veterinario);

    res.json(pacientes)
}


const obtenerPaciente = async ( req, res) => {

    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){ //Si hi ha pacient, el mostrem.
        res.status(404).json( {msg: "No Encontrado"} )
    }

    //Fem una comprovació extra per assegurar-nos que el paciente ha estat afegit pel veterinari.
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) { //Comparem si el id de veterinari del pacient demanat per url, correspon a la id del veterinari que està loggat (emmagatzemat a la "variable global" "req.veterinario" )
      //Hem convertit els objectes en string, ja que si no, no es poden comparar. 
       
        return res.json( {msg: "Acción no válida" } );
    }

    // Mostrem el pacient.
        res.json(paciente);

}


const actualizarPaciente = async ( req, res) => {

    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){ //Si hi ha pacient, el mostrem.
        return res.status(404).json( {msg: "No Encontrado"} )
    }

    //Fem una comprovació extra per assegurar-nos que el paciente ha estat afegit pel veterinari.
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) { //Comparem si el id de veterinari del pacient demanat per url, correspon a la id del veterinari que està loggat (emmagatzemat a la "variable global" "req.veterinario" )
      //Hem convertit els objectes en string, ja que si no, no es poden comparar. 
       
        return res.json( {msg: "Acción no válida" } );
    }

    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;
    
    try{
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);

    } catch (error) {
        console.log(error)
    }    
}

const eliminarPaciente = async ( req, res) => {


    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){ //Si hi ha pacient, el mostrem.
        res.json( {msg: "Paciente no encontrado"});
       return res.status(404).json( {msg: "No Encontrado"} );
    }

    //Fem una comprovació extra per assegurar-nos que el paciente ha estat afegit pel veterinari.
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) { //Comparem si el id de veterinari del pacient demanat per url, correspon a la id del veterinari que està loggat (emmagatzemat a la "variable global" "req.veterinario" )
      //Hem convertit els objectes en string, ja que si no, no es poden comparar. 
       
        return res.json( {msg: "Acción no válida" } );
    }

    try{
       await paciente.deleteOne();
       res.json( {msg: "paciente eliminado"} );

    } catch (error) {
        console.log(error);
    }   

    
}

export { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente };