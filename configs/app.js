import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { config } from 'dotenv'
import cookieParser from 'cookie-parser';
import productRoutes from './../src/product/product.routes.js';
import categoryRoutes from './../src/category/category.routes.js';
import colorRoutes from './../src/color/color.routes.js';
import modelRoutes from './../src/model/model.routes.js';
import userRoutes from './../src/user/user.routes.js';
import './passport.js';

//configuracion
const app = express();
config();
const port = process.env.PORT || 3057;

//configuracion del servidor
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));

//Declaracion de rutas
app.use('/product', productRoutes);
app.use('/category', categoryRoutes);
app.use('/color', colorRoutes);
app.use('/model', modelRoutes);
app.use('/user', userRoutes);

export const initServer = ()=>{
    app.listen(port);
    console.log(`Server HTTP running in port ${port}`);
}

