'use strict'

import jwt from 'jsonwebtoken';
import User from './../user/user.model.js';
import { decript } from '../../utils/crypto.js';

/**
 * Middleware para validar JWT y autorizar el acceso a rutas protegidas.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 * @returns {Object | void} - Retorna un objeto de respuesta HTTP en caso de error, o llama a la función `next` para continuar con el siguiente middleware.
 */
export const validateJwt = async (req, res, next) => {
    try {
        let secretKey = process.env.SECRET_KEY;
        let authorization = req.cookies.authorization;
        if (!authorization) return res.status(401).send({ message: `Acceso no autorizado.` });

        const [encryptedJwt, iv] = authorization.split(`${process.env.STRONGSECURITY}`);

        const decryptedJwt = decript({ iv, encripted: encryptedJwt });
        let { uid } = jwt.verify(decryptedJwt, secretKey);
        //buscar el usuario por id
        let user = await User.findOne({ _id: uid });
        if (!user) return res.status(404).send({ message: `Usuario no registrado.` });
        //validar si esta activo para dar acceso
        if (!user.status) return res.status(403).send({ message: `Unauthorized.` })
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).send({ message: `Invalid token` })
    }
}

export const validateSession = async (req, res) => {
    try {
        console.log("Cookies recibidas:", req.cookies);
        let secretKey = process.env.SECRET_KEY;
        let authorization = req.cookies.authorization;
        console.log("Intento de debbug cookie: ",authorization);
        if (!authorization) return res.status(401).send({ message: `Acceso no autorizado.` });
        const [encryptedJwt, iv] = authorization.split(`${process.env.STRONGSECURITY}`);
        const decryptedJwt = decript({ iv, encripted: encryptedJwt });
        
        let { uid } = jwt.verify(decryptedJwt, secretKey);
        console.log("Data de UID: ",uid);
        let user = await User.findOne({ _id: uid });
        console.log("Data de USER: ",user);
        if (!user) return res.status(404).send({ message: `Usuario no registrado.` });
        if (!user.status) return res.status(403).send({ message: `Unauthorized.` })
        req.user = user;
    user.role = user.role;
        return res.status(200).json({ role: user.role });
    } catch (err) {
        console.error(err);
        return res.status(401).send({ role: user.role })
    }
}

export const closeSession = (req, res) => {
    try {
        res.clearCookie('authorization', {
            httpOnly: true,
            secure: true, // Cambia a false si estás en desarrollo local sin HTTPS
            sameSite: 'None', // Asegúrate de que sea el mismo valor usado en la configuración
            path: '/'
        });
        return res.status(200).send({ message: 'Session closed' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Failed to close session' });
    }
};

/**
 * Middleware para verificar si el usuario autenticado es adminsitrador.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 * @returns {Object|void} - Retorna un objeto de respuesta HTTP en caso de error, o llama a la función `next` para continuar con el siguiente middleware.
 */
export const isAdmin = async (req, res, next) => {
    try {
        let { user } = req;//req que ya tenemos
        if (!user || user.role !== 'ADMINISTRADOR') return res.status(403).send({ message: `Acceso no autorizado.` });
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).send({ message: `Rol no autorizado.` })
    }
}

/**
 * Middleware para verificar si el usuario autenticado es usuario.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 * @returns {Object|void} - Retorna un objeto de respuesta HTTP en caso de error, o llama a la función `next` para continuar con el siguiente middleware.
 */
export const isUser = async (req, res, next) => {
    try {
        let { user } = req;//req que ya tenemos
        if (!user || user.role !== 'USUARIO') return res.status(403).send({ message: `Acceso no autorizado.` });
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).send({ message: `Rol no autorizado` })
    }
}