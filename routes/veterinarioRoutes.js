import express from 'express';
//Importem express per tenir accés a la funció de routing.
import { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword } from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();


// ÁREA PÚBLICA
router.post('/',registrar);  //Com que es per a registre, no seria de tipus get. Millor POST, mes segur.

//Hem de crear un routing dinamic mitjançat els dos punts ":" (es llegeix mitjançant "req.params");
router.get('/confirmar/:token', confirmar);

router.post('/login', autenticar);

router.post('/olvide-password', olvidePassword); //ruta per accedir al nou password

/*
router.get('olvide-password/:token', comprobarToken); //ruta per afegir el nou password. Lenviem per correu i comprobarem el token
router.post('olvide-password/:token', nuevoToken); //ruta per afegir el password nou.
*/ //Aixoò és el mateix que la línia de sota, es pot concatenear. Primer el get, i després el post.
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

//Creem un custom Middleware per tal de controlar qui pot veure o no les pàgines. Exemple, no tothom pot accedir a la pàgina de perfil
//El checkAuth, ens permet saber si l'usuari està autenticat, o no abans que s'executi un altre middleware.
//Creem la carpeta "Controllers" per tal d'organitzar millor les nostres rutes.

//AREA PRIVADA
router.get('/perfil', checkAuth, perfil); //Primer s'executa el callback "checkAuth" (el nostre custom middleware) i com que hi hem ficat un next, sen va a la següent callback, "perfil"
router.put('/perfil/:id',checkAuth, actualizarPerfil)
router.put('/actualizar-password',checkAuth, actualizarPassword)

export default router;


