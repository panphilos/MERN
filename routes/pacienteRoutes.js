import express from 'express';
import { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente } from '../controllers/pacienteController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

//Abans d'agregar qualsevol pacient, hem de comprobar que l'usauri està loguejat. Ho fem col·locant el middleware del checkAuth
router
    .route('/')
    .post(checkAuth, agregarPaciente)
    .get(checkAuth, obtenerPacientes);


//Obtenim un pacient en específic
router 
    .route('/:id')
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)    
    .delete(checkAuth, eliminarPaciente)


export default router;
