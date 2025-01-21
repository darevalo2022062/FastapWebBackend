import { Router } from "express";
import { test, create, read, update, deleteCategory, enableCategory, readCategory } from './category.controller.js';
import { validateJwt, isAdmin } from "../middlewares/validate-jwt.js";

const api = Router();

//=========================//
//      Rutas Publicas    //
//=======================//
api.get('/test', test);
api.get('/getCategory', readCategory);//trae solo los activos

//=========================//
//      Rutas Privadas    //
//=======================//
api.post('/create', [validateJwt, isAdmin], create);
api.get('/get', [validateJwt, isAdmin], read);//trae activos y no activos
api.put('/update/:id', [validateJwt, isAdmin], update);
api.put('/delete/:id', [validateJwt, isAdmin], deleteCategory);
api.put('/enable/:id', [validateJwt, isAdmin], enableCategory);

export default api;