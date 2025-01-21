'use strict'
import Product from './product.model.js';
import Category from './../category/category.model.js';
import Model from '../model/model.model.js';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

export const test = async (req, res) => {
    try {
        console.log('test produto corriendo.');
        return res.send({ message: `Test producto corriendo.` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error en el test de producto.`, err });
    }
}

/*====================*/
/*      CREATE        */
/*====================*/

/**
 * Funcion para crear un nuevo producto.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto que contiene el producto creado.
 * @property {Object} product - El producto recién creado.
 * @property {String} message - Mensaje de confirmación de la creación del producto.
 */
export const create = async (req, res) => {
    try {
        const { name, description, category, color, model, price, specification, status } = req.body;

        if (!name) return res.status(400).send({ message: 'Nombre no ingresado.' });
        if (!category) return res.status(400).send({ message: 'Categoría no ingresada.' });
        if (!price) return res.status(400).send({ message: 'Precio no ingresado.' });

        const colorsArray = Array.isArray(color) ? color.map(id => new ObjectId(id)) : color.split(',').map(id => new ObjectId(id.trim()));
        const modelsArray = Array.isArray(model) ? model.map(id => new ObjectId(id)) : model.split(',').map(id => new ObjectId(id.trim()));
        const specificationsArray = typeof specification === 'string' ? JSON.parse(specification) : specification;

        let data = new Product({
            name,
            description,
            category: new ObjectId(category),
            color: colorsArray,
            model: modelsArray,
            price,
            specification: specificationsArray,
            status
        });

        const product = await data.save();
        return res.send({ message: 'Producto agregado correctamente.', product });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al crear producto.', err });
    }
};

/*====================*/
/*       READ         */
/*====================*/

/**
 * Funcion para obtener todos los productos.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto con todos los productos.
 * @property {Array} products - Array de todos los productos.
 */
export const get = async (req, res) => {
    try {
        const products = await Product.find().populate(
            {
                path: 'category',
                select: 'name'
            }
        ).populate({
            path: 'color',
            select: 'colorCode colorHex image'
        }).populate({
            path: 'model',
            select: 'name'
        });
        return res.send({ products });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener productos.`, err });
    }
}

/**
 * Funcion para obtener los productos activos.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto con los productos activos.
 * @property {Array} products - Array de productos activos.
 */
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: { $in: ['MAS VENDIDO', 'DISPONIBLE'] } })
            .populate({ path: 'category', select: 'name' })
            .populate({ path: 'color', select: 'colorCode colorHex image' })
            .populate({ path: 'model', select: 'name' })

        const statusOrder = { 'MAS VENDIDO': 0, 'DISPONIBLE': 1 }
        products.sort((a, b) => {
            return statusOrder[a.status] - statusOrder[b.status]
        })
        return res.send({ products });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener los productos.`, err });
    }
}

/*====================*/
/*       UPDATE       */
/*====================*/

/**
 * Función para modificar un producto.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto que contiene el producto modificado.
 * @property {Object} product - El producto ya modificado.
 * @property {String} message - Mensaje de confirmación de la modificación del producto.
 */
export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, color, model, price, specification, status } = req.body;
        console.log(req.body);
        // Validaciones
        if (name !== undefined && name.length <= 3) return res.status(400).send({ message: 'Nombre no ingresado o muy corto.' });
        if (category !== undefined && category.length <= 5) return res.status(400).send({ message: 'Categoría no ingresada o muy corta.' });
        if (price !== undefined && price <= 0.00) return res.status(400).send({ message: 'Precio no ingresado o inválido.' });

        // Preparar datos para actualizar
        const data = {};

        if (name) data.name = name;
        if (description) data.description = description;
        if (category) data.category = new ObjectId(category);

        if (color) {
            data.color = Array.isArray(color)
                ? color.map(id => new ObjectId(id))
                : color.split(',').map(id => new ObjectId(id.trim()));
        }

        if (model) {
            data.model = Array.isArray(model)
                ? model.map(id => new ObjectId(id))
                : model.split(',').map(id => new ObjectId(id.trim()));
        }

        if (price) data.price = price;

        if (specification) {
            data.specification = typeof specification === 'string'
                ? JSON.parse(specification)
                : specification;
        }

        if (status !== undefined) data.status = status;

        // Actualizar el producto
        const product = await Product.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        );

        if (!product) return res.status(404).send({ message: 'Producto no encontrado' });
        return res.send({ message: 'Producto modificado correctamente', product });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al modificar el producto.', err });
    }
};



/*====================*/
/*       DELETE       */
/*====================*/

/**
 * Función para deshabilitar un producto.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto que contiene el producto deshabilitado.
 * @property {Object} product - El producto ya deshabilitado.
 * @property {String} message - Mensaje de confirmación de la deshabilitación del producto.
 */
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOneAndUpdate(
            { _id: id },
            { status: 'DESACTIVO' },
            { new: true }
        );
        if (!product) return res.status(404).send({ message: `Producto no encontrado.` });
        return res.send({ message: `Producto deshabilitado correctamente.`, product });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al eliminar el producto.`, err });
    }
}

/*=========================*/
/*       DELETE TOTAL      */
/*=========================*/

/**
 * Función para deshabilitar un producto.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto que contiene el producto deshabilitado.
 * @property {Object} product - El producto ya deshabilitado.
 * @property {String} message - Mensaje de confirmación de la deshabilitación del producto.
 */
export const deleteTotalProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).send({ message: `Producto no encontrado.` });
        return res.send({ message: `Producto Eliminado correctamente.`, product });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al eliminar el producto.`, err });
    }
}

/*====================*/
/*       ENABLE       */
/*====================*/

/**
 * Función para habilitar un producto.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto que contiene el producto habilitado.
 * @property {Object} product - El producto ya habilitado.
 * @property {String} message - Mensaje de confirmación de la habilitación del producto.
 */
export const enableProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOneAndUpdate(
            { _id: id },
            { status: 'DISPONIBLE' },
            { new: true }
        );
        if (!product) return res.status(404).send({ message: `Producto no encontrado.` });
        return res.send({ message: `Producto habilitado correctamente.`, product });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al habilitar el producto.`, err });
    }
}

/*====================*/
/*       FILTER       */
/*====================*/

export const getProductByName = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).send({ message: `Producto no encontrado 1.` });
        if (typeof name !== 'string' || !name.trim()) return res.status(400).send({ message: `Nombre invalido.` });
        const products = await Product.find({
            name: { $regex: name.trim(), $options: 'i' }
        });
        if (products.length === 0) return res.status(404).send({ message: `Producto no encontrado` })
        return res.send({ products });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener los productos.` })
    }
}

//funcion para obtener producto por id
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar el formato del ID
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send({ message: `ID inválido.` });
        
        // Buscar el producto y poblar las referencias
        const product = await Product.findById(id)
            .populate({
                path: 'category',
                select: 'name'
            })
            .populate({
                path: 'color',
                select: 'colorCode colorHex image'
            })
            .populate({
                path: 'model',
                select: 'name'
            });
        
        // Verificar si el producto fue encontrado
        if (!product) return res.status(404).send({ message: `Producto no encontrado.` });
        
        return res.send({ product });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener el producto.` });
    }
}


//funcion para obtener el producto segun la categoria
export const getProductByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        if (typeof category !== 'string' || category.trim() === '') return res.status(400).send({ message: `Categoría inválida.` });

        const result = await Category.findOne({
            name: { $regex: category.trim(), $options: 'i' }//si es sencible a tildes
        });
        if (!result) return res.status(404).send({ message: `Categoria no encontrada.` });

        const products = await Product.find({
            category: result._id
        }).populate(
            {
                path: 'category',
                select: 'name'
            }
        ).populate({
            path: 'color',
            select: 'colorCode colorHex image'
        }).populate({
            path: 'model',
            select: 'name'
        });
        if (products.length === 0) return res.status(404).send({ message: `Productos no encontrados.` });
        return res.send({ products });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener los producto.` });
    }
}


export const getProductByModel = async (req, res) => {
    try {
        const { model } = req.params;
        if (typeof model !== 'string' || model.trim() == '') return res.status(400).send({ message: `Modelo inválido.` });
        const response = await Model.findOne({ name: model });
        if (!response) return res.status(404).send({ message: `Modelo no encontrado.` });
        const products = await Product.find({ model: response.id })
            .populate(
                {
                    path: 'category',
                    select: 'name'
                }
            ).populate({
                path: 'color',
                select: 'colorCode colorHex image'
            }).populate({
                path: 'model',
                select: 'name'
            });
        if(products.length === 0) return res.status(404).send({message: 'Productos no encontrados.'});
        return res.send({products}); 
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener los productos.` });
    }
}