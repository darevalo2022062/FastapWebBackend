'use strict'
import { generateJwt, generateJwtRecovery } from '../../utils/jwt.js';
import { encrypt, checkEncrypt, checkUsername, checkEmail, checkPassword, checkName } from '../../utils/validator.js';
import User from './user.model.js';
import { encriptar, decript } from '../../utils/crypto.js';
import { sendConfirmAccount, sendRecovery } from '../email/nodemailer.js';
import jwt from 'jsonwebtoken';
const { TokenExpiredError } = jwt;

export const test = async (req, res) => {
    try {
        console.log('test user corriendo');
        return res.send({ message: `Test user corriendo` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error en test` });
    }
}

export const testPasswords = async (req, res) => {
    console.log("Probando contraseñas:");

    const passwordsToTest = [
        "9ypZbjZx%123", // Tu contraseña
        "Password123!", // Contraseña típica válida
        "password123",  // Falta mayúscula y carácter especial
        "PASSWORD123",  // Falta minúscula y carácter especial
        "Password!@#",  // Falta dígito
        "Short1!"       // Menos de 8 caracteres
    ];

    passwordsToTest.forEach(pass => {
        const result = checkPassword(pass);
        console.log(`La contraseña "${pass}" es ${result ? 'válida' : 'inválida'}.`);
    });
    return res.send({ message: `Test finalizado` })
}

/*====================*/
/*       LOGIN        */
/*====================*/
//archivo encargado -> configs/passport.js

/*====================*/
/*      CREATE        */
/*====================*/

/**
 * Función para registrar al usuario.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto que contiene el token del usuario registrado.
 * @property {String} token - El token generado para el usuario registrado.
 * @property {String} message - Mensaje de bienvenida.
 * @property {String} role - Rol del usuario registrado.
 */
export const create = async (req, res) => {
    try {
        //extraccion de la data.
        let { username, name, email, password } = req.body;
        //validacion del username
        if (!username) return res.status(400).send({ message: 'Username no ingresado.' });
        if (!checkUsername(username)) return res.status(400).send({ message: 'Longitud minima de 5 y maxima de 10' });

        //validacion de nombre
        if (!name) return res.status(400).send({ message: `Nombre no ingresado.` });
        if (!checkName(name)) return res.status(400).send({ message: `Nombre no valido.` });

        //validacion de email
        if (!email) return res.status(400).send({ message: 'Email no ingresado.' });
        if (!checkEmail(email)) return res.status(400).send({ message: 'Formato de email inválido.' });

        //validacion de password
        if (!password) return res.status(400).send({ message: 'Password no ingresado.' });
        console.log("Esta es la password Papito", password);
        console.log(checkPassword(password), password);
        if (!checkPassword(password)) return res.status(400).send({ message: 'Contraseña insegura.' });

        //se asigna el rol por defecto
        const role = 'USUARIO';
        password = await encrypt(password);
        //creacion de usuario
        const data = {
            username,
            name,
            email,
            password,
            role
        }

        //usuario creado
        const user = new User(data);
        //guardar en la db


        const loggedUser = {
            uid: user._id,
            username: user.username,
            name: user.name,
            role: user.role
        }

        const token = await generateJwtRecovery(loggedUser);

        user.confirmEmail = token;
        await user.save();
        user.password = undefined;

        const { iv, encripted } = encriptar(token);
        const autorizationHeader = `${encripted}.${iv}`

        const link = `http://localhost:5173/confirm-email/${token}`;
        await sendConfirmAccount(user.email, user.username, link);
        autorizationHeader == null;
        return res.send({
            message: `¡Hola ${user.username}, revisa tu correo para confirmar tu cuenta!`
            
        })
    } catch (err) {
        console.error(err);
        if (err.code === 11000) { // Error de duplicidad
            if (err.keyPattern?.username) {
                return res.status(400).send({ message: 'El username ya existe.' });
            } else if (err.keyPattern?.email) {
                return res.status(400).send({ message: 'El email ya existe.' });
            }
        }
        return res.status(500).send({ message: 'Error al crear usuario.' });
    }
}

export const confirmAccount = async (req, res) => {
    try {

        let { authorization } = req.params;
        /*
        console.log("Sí lelga hasta la autorización: ",authorization);
        if (!authorization) return res.status(401).send({ message: `Acceso no autorizado.` });
        const [encryptedJwt, iv] = authorization.split(`.`);
        if (!iv || !encryptedJwt) return res.status(400).send({ message: `Token invalido y/o expirado` });
        const decryptedJwt = decript({ iv, encripted: encryptedJwt });
        if (!decryptedJwt) return res.status(400).send({ message: `Ha ocurrido un problema. Intente de nuevo.` });
*/
        let { uid } = jwt.verify(authorization, process.env.SECRET_KEY);
        console.log("Este es el uid: ", uid);
        let user = await User.findById(uid);
        console.log("Este es el usuario: ", user);
        if (!user) {
            return res.status(404).send({ message: `Cuenta no registrada.` })
        }


        //status true para que pueda acceder.
        User.findByIdAndUpdate(uid, { status: true, confirmEmail: null }, { new: true }).exec();

        //front redirige a el login nuevamente para que se logee y ya le deje acceder.
        return res.send({ message: `Cuenta confirmada!` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al confirmar la cuenta.` });
    }
}

/*====================*/
/*       READ         */
/*====================*/

/**
 * Función para obtener a los usuarios registrados.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto que contiene los usuarios registrados.
 * @property {Array} users - Array de todos los usuarios.
 */
export const read = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ name: 1 });
        return res.send({ users });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener los usuarios.` });
    }
}

/*====================*/
/*       UPDATE       */
/*====================*/

/**
 * Función para modificar a otro usuario.
 * @param {Required} req para escuchar la peticion del cliente.
 * @param {Response} res para retornar la solicitud al cliente.
 * @returns {Object} Se retorna el usuario modificado. 
 * @property {Object} user - El objeto contiene el usuarios modificado.
 * @property {String} message - Mensaje de modificación exitosa.
 */
export const modifyOtherCount = async (req, res) => {
    try {
        //extraccion de username y email
        const { id, username, name, email } = req.body;
        //validacion de id
        if (!id) return res.status(400).send({ message: `Identificador no ingresado.` });

        //validacion del username
        if (username && !checkUsername(username)) return res.status(400).send({ message: 'Username invalido.' });

        //validacion de nombre
        if (name && !checkName(name)) return res.status(400).send({ message: `Nombre no valido.` });

        //validacion de email
        if (email && !checkEmail(email)) return res.status(400).send({ message: 'Formato de email inválido.' });

        const data = {
            username,
            name,
            email
        }

        const user = await User.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        user.password = undefined;
        if (!user) return res.status(404).send({ message: `Usuario no encontrado.` });
        return res.send({ message: `Usuario modificado.`, user });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al modificar el usuario.` });
    }
}

/**
 * Funcion para modificar el usuario logeado.
 * @param {Required} req para escuchar la peticion del cliente.
 * @param {Response} res para retornar la solicitud al cliente.
 * @returns {Object} Se retorna la cuenta modificada. 
 * @property {Object} user - El objeto con el usuario modificado.
 * @property {String} message - Mensaje de modificación exitosa.
 */
export const modifyPersonalCount = async (req, res) => {
    try {
        const { _id } = req.user;
        const { username, name, email } = req.body;

        //validación del objeto de entrada
        if (typeof req.body !== 'object' || req.body === null) {
            return res.status(400).send({ message: 'Los datos enviados no son válidos.' });
        }

        //validacion del username
        if (username != undefined && !checkUsername(username)) return res.status(400).send({ message: 'Username invalido.' });
        //validacion de nombre
        if (name != undefined && !checkName(name)) return res.status(400).send({ message: `Nombre no valido.` });
        //validacion de email
        if (email != undefined && !checkEmail(email)) return res.status(400).send({ message: 'Formato de email inválido.' });

        let data = {};
        if (username) data.username = username;
        if (name) data.name = name;
        if (email) data.email = email;
        const user = await User.findOneAndUpdate(
            { _id },
            data,
            { new: true }
        );
        user.password = undefined;
        return res.send({ message: `Cuenta modificada.`, user });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al modificar cuenta.` });
    }
}

/*====================*/
/*       DELETE       */
/*====================*/

/**
 * Funcion para inhabilitar la cuenta de un usuario.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto con la cuenta deshabilitada.
 * @property {Object} user - El objeto con la cuenta deshabilitada.
 * @property {String} message - Mensaje de cuenta deshabilitada exitosanente.
 */
export const deletePersonalAccount = async (req, res) => {
    try {
        const { _id, password } = req.user;
        const { confirmPass } = req.body;
        if (!confirmPass) return res.status(400).send({ message: `Confirma la contraseña` });
        if (!await checkEncrypt(confirmPass, password)) return res.status(401).send({ message: `Password invalida.` });

        const user = await User.findByIdAndUpdate(
            { _id },
            { status: false },
            { new: true }
        )

        if (!user) return res.status(404).send({ message: `Usuario no encontrado.` });
        return res.send({ message: `Cuena eliminada.`, user });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al eliminar cuenta.` });
    }
}

/*====================*/
/*       ENABLE       */
/*====================*/

/**
 * Funcion para habilitar la cuenta de un usuario.
 * @param {Request} req - Objeto de solicitud para escuchar la petición del cliente.
 * @param {Response} res - Objeto de respuesta para retornar la solicitud al cliente.
 * @returns {Object} Retorna un objeto con la cuenta habilitada.
 * @property {Object} user - El objeto con la cuenta habilitada.
 * @property {String} message - Mensaje de habilitación exitosa.
 */
export const enableAccount = async (req, res) => {
    try {
        const { id } = req.params;

        // Validamos si id existe en el cuerpo de la solicitud
        if (!id) return res.status(400).send({ message: 'Se requiere proporcionar un ID de usuario.' });

        const user = await User.findOneAndUpdate(
            { _id: id },
            { status: true },
            { new: true }
        )
        if (!user) return res.status(404).send({ message: `Usuario no encontrado` });
        return res.send({ message: `Cuenta habilitada`, user });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al habilitar la cuenta.` });
    }
}

/*====================*/
/* RECOVERY  PASSWORD */
/*====================*/

export const recoveryPassword = async (req, res) => {
    try {
        const { email } = req.body;
        //validar si el email ingresado esta en nuestra base de datos.
        const user = await User.findOne({ email }).select('-password');
        if (!user) return res.status(401).send({ message: `Email enviado.` }); //para despistar a los atacantes;

        //generar token
        const recoveryUser = {
            uid: user._id,
            username: user.username
        }
        const token = await generateJwtRecovery(recoveryUser);

        //guardar el token en la base de datos
        await User.updateOne(
            { _id: user._id },
            { $set: { recoveryToken: token } }
        ).exec();

        //cifrar el token
        const { iv, encripted } = encriptar(token);
        const autorizationHeader = `${encripted}.${iv}`

        //enviar el email
        const link = `https://fastap.com/recovery?token=${autorizationHeader}`;//equipo de front se encarga de esto
        await sendRecovery(user.email, user.username, link);
        autorizationHeader == null;
        return res.send({ message: `Email enviado.` })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al recuperar la contraseña' })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        let { authorization } = req.params;

        if (!authorization) return res.status(401).send({ message: `Acceso no autorizado.` });

        const [encryptedJwt, iv] = authorization.split(`.`);
        if (!iv || !encryptedJwt) return res.status(400).send({ message: `Token invalido y/o expirado` });

        const decryptedJwt = decript({ iv, encripted: encryptedJwt });
        if (!decryptedJwt) return res.status(400).send({ message: `Ha ocurrido un problema. Intente de nuevo.` });
        let { uid } = jwt.verify(decryptedJwt, process.env.SECRET_KEY);
        //buscar el usuario por id
        let user = await User.findOne({ _id: uid }).select('-password');
        if (!user) return res.status(404).send({ message: `Usuario no registrado.` });
        //validar si esta activo para dar acceso
        if (!user.status) return res.status(403).send({ message: `Unauthorized.` });

        if (user.recoveryToken !== decryptedJwt) return res.status(401).send({ message: `Token invalido y/o expirado.` });
        //validacion de password
        if (!newPassword) return res.status(400).send({ message: 'Password no ingresado.' });
        if (!checkPassword(newPassword)) return res.status(400).send({ message: 'Contraseña insegura.' });
        const hash = await encrypt(newPassword);
        await User.updateOne(
            { _id: user._id },
            {
                recoveryToken: null,
                password: hash
            }
        )

        return res.send({ message: `Password modificada con exito.` });
    } catch (err) {
        if (err instanceof TokenExpiredError) return res.status(401).send({ message: `Token invalido y/o expirado.` });
        if (err.code === 'ERR_OSSL_BAD_DECRYPT') return res.status(400).send({ message: `Ha ocurrido un problema.` });
        console.error(err);
        return res.status(500).send({ message: `Error al cambiar la contraseña.` })
    }
}