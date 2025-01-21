import { Schema, model } from "mongoose";

const modelSchema = new Schema({
    name: {
        type: String,
        unique: [true, 'Modelo debe de ser único.'],
        required: [true, 'El nombre de modelo es requerido.']
    },
    status:{
        type: Boolean,
        default: true,
        required: [true, 'Status de modelo requerido.']
    }
}, {
    versionKey: false
});

export default model('Model', modelSchema)