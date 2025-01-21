import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        unique: [true, 'Username debe de ser unico.'],
        required: [true, 'Username requerido.']
    },
    name: {
        type: String,
        required: [true, 'Nombre requerido.']
    },
    email: {
        type: String,
        required: [true, 'Email es requerido'],
        unique: [true, 'Correo ya asociado']
    },
    confirmEmail:{
        type: String
    },
    password: {
        type: String,
        required: [true, 'Contraseña requerida.']
    },
    recoveryToken:{
        type: String
    },
    role: {
        type: String,
        enum: ['USUARIO', 'ADMINISTRADOR'],
        required: [true, 'Rol requerido.']
    },
    status: {
        type: Boolean,
        default: false,
        required: [true, 'Estado de usuario requerido']
    }
}, {
    versionKey: false,
    autoIndex: true
})

export default model('User', userSchema);