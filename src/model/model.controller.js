'use strict'
import Model from './model.model.js';

export const test = async (req, res) => {
    try {
        console.log('test modelo corriendo.');
        return res.send({ message: `Test modelo corriendo.` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error en test modelo.` });
    }
}

/*====================*/
/*      CREATE        */
/*====================*/

/**
 * Funcion para crear un modelo.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto que contiene el modelo creado.
 * @property {Object} model - El objeto ya creado.
 * @property {String} message - Mensaje de confirmación de creación del modelo.
 */
export const create = async (req, res) => {
    try {
        //extraccion de name.
        const { name } = req.body;
        //validaciones del name.
        if (!name) return res.status(400).send({ message: `Nombre del modelo requerido.` });
        if (name.length < 2) return res.status(400).send({ message: `Longitud del modelo invalido.` });
        //cracion del nuevo modelo
        const model = new Model({ name });
        //se guarda en la base de datos.
        await model.save();
        //respuesta exitosa.
        return res.send({ message: `Modelo agregado correctamente.`, model });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al crear el modelo.` });
    }
}

/*====================*/
/*       READ         */
/*====================*/

/**
 * Funcion para obtener todos los modelos.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto con todos los modelos.
 * @property {Array} model - Array de todos los modelos. 
 * 
 */
export const read = async (req, res) => {
    try {
        const model = await Model.find().sort({ name: 1 });
        return res.send({ model });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener los modelos.` });
    }
}

/**
 * Funcion para obtener los modelos activos.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto con los modelos activos.
 * @property {Array} model - Array de los modelos activos.
 */
export const readModel = async (req, res) => {
    try {
        const model = await Model.find({ status: true }).sort({ name: 1 });
        return res.send({ model });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener los modelos.` });
    }
}

/*====================*/
/*       UPDATE       */
/*====================*/

/**
 * Funcion para modificar el nombre del modelo.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto con el modelo modificado.
 * @property {Object} model - El objeto que contiene el modelo modificado.
 * @property {String} message - Mensaje de modificación exitosa.
 */
export const update = async (req, res) => {
    try {
        //extraccion de id y name
        const {id} = req.params;
        const {name } = req.body;
        //validaciones
        if (!id) return res.status(400).send({ message: `Id no proporcionado.` });
        if (!name) return res.staus(400).send({ message: `Nombre no proporcionado.` });
        if (name.length < 5) return res.staus(400).send({ message: `Formato de nombre invalido.` });

        //buscar y modificar el modelo
        const model = await Model.findOneAndUpdate(
            { _id: id },
            { name },
            { new: true }
        );
        //validar si se encontro el modelo
        if (!model) return res.status(404).send({ message: `Modelo no encontrado.` });
        //retornar la respuesta exitosa.
        return res.send({ message: `Modelo modificado`, model });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al modificar el modelo.` });
    }
}

/*====================*/
/*       DELETE       */
/*====================*/

/**
 * Funcion para deshabilitar un modelo existente.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto que contiene el modelo deshabilitado.
 * @property {Object} model - El objeto que contiene el modelo deshabilitado.
 * @property {String} message - Mensaje de deshabilitación exitosa.
 */
export const deleteModel = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).send({ message: `Id no ingresada.` });
        const model = await Model.findOneAndUpdate(
            { _id: id },
            { status: false },
            { new: true }
        );
        if (!model) return res.status(404).send({ message: `Modelo no encontrado.` });
        return res.send({ message: `Modelo deshabilitado.`, model });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al eliminar el modelo.` });
    }
}

/*====================*/
/*       ENABLE       */
/*====================*/

/**
 * Funcion para habilitar un modelo existente.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto que contiene el modelo habilitado.
 * @property {Object} model - El objeto que contiene el modelo habilitado.
 * @property {String} message - Mensaje de habilitación exitosa.
 */
export const enableModel = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).send({ message: `Id no ingresada.` });
        const model = await Model.findOneAndUpdate(
            { _id: id },
            { status: true },
            { new: true }
        );
        if (!model) return res.status(404).send({ message: `Modelo no encontrado.` });
        return res.send({ message: `Modelo habilitado.`, model });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al habilitar el modelo.` });
    }
}