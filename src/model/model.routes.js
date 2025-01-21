import { Router } from "express";
import { test, create, read, readModel, update, deleteModel, enableModel } from './model.controller.js';
import { validateJwt, isAdmin } from "../middlewares/validate-jwt.js";
const api = Router();

//=========================//
//      Rutas Publicas    //
//=======================//
api.get('/test', test);
api.get('/getModel', readModel);//modelos activos

//=========================//
//      Rutas Privadas    //
//=======================//

api.post('/create', [validateJwt, isAdmin], create);
api.get('/get', [validateJwt, isAdmin], read);//modelos activos y no activos.
api.put('/update/:id', [validateJwt, isAdmin], update);
api.put('/delete/:id', [validateJwt, isAdmin], deleteModel);
api.put('/enable/:id', [validateJwt, isAdmin], enableModel);


export default api;