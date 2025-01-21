import multer from 'multer';
import { Router } from 'express';
import { test, create, get, getProducts, update, deleteProduct, enableProduct, getProductById, getProductByName, getProductByCategory, getProductByModel, deleteTotalProduct } from "./product.controller.js";
import { validateJwt, isAdmin } from "../middlewares/validate-jwt.js";
import pkg from 'body-parser';

const { json, urlencoded } = pkg;
const api = Router();
const upload = multer(); // Inicializa multer

//=========================//
//      Rutas Publicas    //
//=======================//

api.get('/test', test);
api.get('/getProducts', getProducts);
api.get('/getProduct/:id', getProductById);
api.get('/search', getProductByName);
api.get('/getProducts/:category', getProductByCategory);
api.get('/getProductsModel/:model', getProductByModel);

//=========================//
//      Rutas Privadas    //
//=======================//
api.get('/get', [validateJwt, isAdmin], get);
api.post('/create', [validateJwt, isAdmin, upload.none()], create);
api.put('/update/:id', [validateJwt, isAdmin, upload.none()], update);
api.put('/delete/:id', [validateJwt, isAdmin], deleteProduct);
api.delete('/deleteTotal/:id', [validateJwt, isAdmin, json()], deleteTotalProduct);
api.put('/enable/:id', [validateJwt, isAdmin], enableProduct);

export default api;
