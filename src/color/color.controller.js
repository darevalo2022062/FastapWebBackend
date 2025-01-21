'use strict'
import Color from './color.model.js'
import FormData from 'form-data';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

/*====================*/
/*        TEST        */
/*====================*/
export const test = async (req, res) => {
    try {
        console.log('test color corriendo.');
        return res.send({ message: `Test color corriendo.` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error en test color.` });
    }
}

/*====================*/
/*      CREATE        */
/*====================*/

/**
 * Sube una imagen al servidor de ImgBB usando FormData.
 * @param {Buffer} image - El búfer de la imagen a subir.
 * @param {string} name - El nombre o nombre de archivo para la imagen.
 * @returns {Promise<string>} La URL de la imagen subida en caso de éxito.
 * @throws {Error} Si falla la carga de la imagen.
 */
const uploadImage = async (image, name) => {
    const baseURL = `https://api.imgur.com/3/image`;
    //const authorization = `https://api.imgur.com/oauth2/authorize?client_id=${process.env.IMGUR_CLIENT_ID_1}&response_type=token&state=null`;
    try {
        const formData = new FormData();
        formData.append('image', image.buffer.toString('base64'));
        formData.append('title', name);
        formData.append('description', `Color Whit code ${name}`);


        const response = await axios.post(baseURL, formData, {
            headers: {
                "Authorization": `Client-ID ${process.env.IMGUR_CLIENT_ID_1}`,
            }
        });
        
        return response.data.data.link;
    } catch (err) {
        console.error(err);
        throw new Error('Error uploading images');
    }
}

/**
 * Funcion para crear un color.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Se retorna un objeto que contiene el color creado.
 * @property {Object} color - El color recién creado.
 * @property {String} message - Mensaje de confirmación del color creado.
 */
export const create = async (req, res) => {
    try {
        const { colorCode, colorHex } = req.body;
        const image = req.file;


        //validacion de data.
        if (!colorCode || !colorHex || !image) {
            if (!colorCode) return res.status(400).send({ message: `Color no ingresado.` });
            if (!colorHex) return res.status(400).send({ message: `Color no ingresado` });
            if (!image) return res.status(400).send({ message: `Imagen no ingresada.` });
        }

        console.log("Antes de subir imagen Backend")
        //subir imagen
        const url = await uploadImage(image, colorCode);

        //creacion de data
        let data = {
            colorCode,
            colorHex,
            image: url
        }

        //instancia de color.
        let color = new Color(data);
        //creacion de color.
        await color.save()
        //mensaje de respuesta.
        return res.send({ message: `Color agregado correctamente.`, color });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al crear el color.` });
    }
}

/*====================*/
/*       READ         */
/*====================*/

/**
 * Funcion para obtener todos los colores.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto con todos los colores.
 * @property {Array} data - Array de todos los colores.
 */
export const read = async (req, res) => {
    try {
        //obtener los colores de la base de datos.
        let data = await Color.find().sort({ colorCode: 1 });
        //respuesta con los colores.
        return res.send({ data });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener los colores.` });
    }
}

/**
 * Funcion para obtener los colores activos.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto con los colores activos.
 * @property {Array} data - Array de colores activos.
 */
export const readColor = async (req, res) => {
    try {
        //obtener los colores activos de la base de datos.
        let data = await Color.find({ status: true }).sort({ colorCode: 1 });
        //respuesta con los colores
        return res.send({ data });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener los colores.` });
    }
}

/*====================*/
/*       UPDATE       */
/*====================*/

/**
 * Funcion para modificar el color.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto que contiene el color modificado.
 * @property {Object} dataUpdate - El objeto que contiene el color modificado.
 * @property {String} message - Mensaje de confirmación al color modificado.
 */
export const update = async (req, res) => {
    try {
        //extraccion de data e id
        const { id } = req.params;
        const { colorCode, colorHex } = req.body;
        let image = null;
        if (req.file) {
            image = req.file;
            const url = await uploadImage(image, colorCode);
            image = url;
        }
        //validacion de data.
        if (colorCode && colorCode.lenght < 5) return res.status(400).send({ message: `Error en código de color.` });
        if (colorHex && colorHex.lenght < 3) return res.status(400).send({ message: `Error en color hex.` });
        //creacion de la nueva data.

        let data = {};

        if (req.file) {
            data = {
                colorCode,
                colorHex,
                image
            }
        } else {
            data = {
                colorCode,
                colorHex
            }
        }



        //modificacion del color

        const dataUpdate = await Color.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        //mensaje si no se encuentra el color.
        if (!dataUpdate) return res.status(404).send({ message: `Id color no encontrado.` });
        //mensaje de respuesta - correcto.
        return res.send({ message: `Color modificado`, dataUpdate });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al modificar el color.` });
    }
}

/*====================*/
/*       DELETE       */
/*====================*/

/**
 * Funcion para deshabilitar el color.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto que contiene el color deshabilitado.
 * @property {Objet} deleteColor - El objeto que contiene el color deshabilitado.
 * @property {Object} message - Mensaje de confirmación al color deshabilitado.
 */
export const deleteColor = async (req, res) => {
    try {
        //extraccion del id.
        const { id } = req.params;
        //validamos si se ingreso el id.
        if (!id) return res.status(400).send({ message: `Id invalido.` });
        //buscamos el color y lo eliminamos.
        const deleteColor = await Color.findOneAndUpdate({ _id: id }, { status: false }, { new: true });
        //validamos si se encontro el color en la base de datos.
        if (!deleteColor) return res.status(404).send({ message: `Color no encontrado.` });
        //retornar la respuesta.
        return res.send({ message: `Color deshabilidato.`, deleteColor });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al deshabilitar el color.` });
    }
}


/*====================*/
/*      TOTAL DELETE  */
/*====================*/

/**
 * Funcion para deshabilitar el color.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto que contiene el color deshabilitado.
 * @property {Objet} deleteColor - El objeto que contiene el color deshabilitado.
 * @property {Object} message - Mensaje de confirmación al color deshabilitado.
 */
export const deleteTotalColor = async (req, res) => {
    try {
        //extraccion del id.
        const { id } = req.params;
        //validamos si se ingreso el id.
        if (!id) return res.status(400).send({ message: `Id invalido.` });
        //buscamos el color y lo eliminamos.
        const deleteColor = await Color.findByIdAndDelete({ _id: id });
        //validamos si se encontro el color en la base de datos.
        if (!deleteColor) return res.status(404).send({ message: `Color no encontrado.` });
        //retornar la respuesta.
        return res.send({ message: `Color deshabilidato.`, deleteColor });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al deshabilitar el color.` });
    }
}

/*====================*/
/*       ENABLE       */
/*====================*/
/**
 * Funcion para habilitar el color.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto que contiene el color habilitado.
 * @property {Objet} enableColor - El objeto que contiene el color deshabilitado.
 * @property {Object} message - Mensaje de confirmación al color habilitado.
 */
export const enableColor = async (req, res) => {
    try {
        //extraccion del id.
        const { id } = req.params;
        //validamos si se ingreso el id.
        if (!id) return res.status(400).send({ message: `Id invalido.` });
        //buscamos el color y lo eliminamos.
        const enableColor = await Color.findOneAndUpdate({ _id: id }, { status: true }, { new: true });
        //validamos si se encontro el color en la base de datos.
        if (!enableColor) return res.status(404).send({ message: `Color no encontrado.` });
        //retornar la respuesta.
        return res.send({ message: `Color habilitado.`, enableColor });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al habilitar el color.` });
    }
}
