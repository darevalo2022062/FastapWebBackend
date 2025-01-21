import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
    name:{
        type: String,
        unique: [true, 'La categoria debe de ser única.'],
        required: [true, 'Categoria es requerida.']
    },
    status:{
        type: Boolean,
        default: true,
        required: [true, 'Status de categoria requerido.']
    }
}, {
    versionKey: false
});

export default model('Category', categorySchema);