'use strict'
import Category from './category.model.js';

/*====================*/
/*        TEST        */
/*====================*/

export const test = async (req, res) => {
    try {
        console.log('test categoria corriendo.');
        return res.send({ message: `Test categoria corriendo.` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error test categoria.` });
    }
}

/*====================*/
/*      CREATE        */
/*====================*/

/**
 * Funcion para crear una categoria.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto que contiene la categoría creada.
 * @property {Object} category - El objeto con la categoría creada.
 * @property {String} message - Mensaje de creación exitosa.
 */
export const create = async (req, res) => {
    try {
        //extraccion de name.
        const { name } = req.body;
        //validaciones del name.
        if (!name) return res.status(400).send({ message: `Nombre de categoria requerido.` });
        if (name.length < 5) return res.status(400).send({ message: `Longitud de categoria invalida.` });
        //cracion de la nueva categoria
        const category = new Category({ name });
        //se guarda en la base de datos.
        await category.save();
        //respuesta exitosa.
        return res.send({ message: `Categoria agregada correctamente.`, category });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al crear categoria.` });
    }
}

/*====================*/
/*       READ         */
/*====================*/

/**
 * Funcion para obtener todas las categorias.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto que contiene las categorias.
 * @property {Array} category - Array con todas las categorias.
 */
export const read = async (req, res) => {
    try {
        const category = await Category.find().sort({ name: 1 });
        return res.send({ category });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener las categorias.` });
    }
}

/**
 * Funcion para obtener las categorias activas.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto con las categorias activas.
 * @property {Array} category - Array con las categorias activas.
 */
export const readCategory = async (req, res) => {
    try {
        const category = await Category.find({ status: true }).sort({ name: 1 });
        return res.send({ category });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener las categorias.` });
    }
}

/*====================*/
/*       UPDATE       */
/*====================*/

/**
 * Funcion para modificar el nombre de la categoria.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto que contiene la categoría modificada.
 * @property {Object} category - El objeto con la categoría modificada.
 * @property {String} message - Mensaje de modificación exitosa.
 */
export const update = async (req, res) => {
    try {
        //extraccion de id y name
        const { id } = req.params;
        const { name } = req.body;
        //validaciones
        if (!id) return res.staus(400).send({ message: `Id no proporcionado.` });
        if (!name) return res.staus(400).send({ message: `Nombre no proporcionado.` });
        if (name.length < 5) return res.staus(400).send({ message: `Formato de nombre invalido.` });

        //buscar y modificar categoria
        const category = await Category.findOneAndUpdate(
            { _id: id },
            { name },
            { new: true }
        );
        //validar si se encontro la categoria
        if (!category) return res.status(404).send({ message: `Categoria no encontrada.` });
        //retornar la respuesta exitosa.
        return res.send({ message: `Categoria modificada`, category });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al modificar la categoria.` });
    }
}

/*====================*/
/*       DELETE       */
/*====================*/

/**
 * Funcion para deshabilitar una categoria existente.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto que contiene la categoría deshabilitada.
 * @property {Object} category - El objeto con la categoría deshabilitada.
 * @property {String} message - Mensaje de deshabilitación exitosa.
 */
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).send({ message: `Id no ingresada.` });
        const category = await Category.findOneAndUpdate(
            { _id: id },
            { status: false },
            { new: true }
        );
        if (!category) return res.status(404).send({ message: `Categoria no encontrada.` });
        return res.send({ message: `Categoria deshabilitada.`, category });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al eliminar la categoria.` });
    }
}

/*====================*/
/*       ENABLE       */
/*====================*/

/**
 * Funcion para habilitar una categoria existente.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto que contiene la categoría habilitada.
 * @property {Object} category - El objeto con la categoría habilitada.
 * @property {String} message - Mensaje de habilitación exitosa. 
 */
export const enableCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findOneAndUpdate(
            { _id: id },
            { status: true },
            { new: true }
        );
        if (!category) return res.status(404).send({ message: `Categoria no encontrada.` });
        return res.send({ message: `Categoria habilitada.`, category });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al habilitar la categoria.` });
    }
}