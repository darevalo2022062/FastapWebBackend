import express from 'express';
import multer from 'multer';
import { test, create, read, update, deleteColor, enableColor, readColor, deleteTotalColor } from './color.controller.js';
import { validateJwt, isAdmin } from '../middlewares/validate-jwt.js';
import pkg from 'body-parser';
const { json, urlencoded } = pkg;

const api = express.Router();
const upload = multer(); // Configuración de multer para manejar archivos.

//=========================//
//      Rutas Públicas     //
//=========================//
api.get('/test', test);
api.get('/getColor', readColor); // Rutas públicas que no requieren manejo de archivos.

//=========================//
//      Rutas Privadas     //
//=========================//

// Ruta POST /create: Esta ruta maneja archivos, por lo que usamos multer.
api.post('/create', [validateJwt, isAdmin, upload.single('image')], create);

// Rutas que no manejan archivos: Usamos body-parser para manejar JSON.
api.get('/get', [validateJwt, isAdmin, json()], read);
api.put('/update/:id', [validateJwt, isAdmin, upload.single('image')], update);
api.put('/delete/:id', [validateJwt, isAdmin, json()], deleteColor);
api.delete('/deleteTotal/:id', [validateJwt, isAdmin, json()], deleteTotalColor);
api.put('/enable/:id', [validateJwt, isAdmin, json()], enableColor);

export default api;
