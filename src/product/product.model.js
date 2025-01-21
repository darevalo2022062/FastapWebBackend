import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido.']
    },
    description: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Categoria requerida.']
    },
    color: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Color'
        }
    ],
    model: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Model'
        }
    ],
    price: {
        type: Number,
        min: [0, 'El precio no puede ser negativo.'],
        required: [true, 'Precio requerido.']
    },
    specification: [
        {
            title: {
                type: String
            },
            detail: {
                type: String
            }
        }
    ],
    status: {
        type: String,
        enum: ['DISPONIBLE', 'AGOTADO', 'MAS VENDIDO', "DESACTIVO"],
        default: 'DISPONIBLE',
        required: [true, 'Estatus del producto requerido.']
    }
}, {
    versionKey: false
});

export default model('Product', productSchema);