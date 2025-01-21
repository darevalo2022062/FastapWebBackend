import { Schema, model } from 'mongoose';

const colorSchema = new Schema({
    colorCode: {
        type: String,
        unique: [true, 'El código de color debe ser único.'],
        required: [true, 'El código de color es requerido.']
    },
    colorHex: {
        type: String,
        required: [true, 'El color es requerido.'],
    },
    image: {
        type: String
    },
    status: {
        type: Boolean,
        default: true,
        required: [true, 'Estado del color requerido.']
    }
}, {
    versionKey: false
});

export default model('Color', colorSchema);