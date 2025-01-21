'use strict'

import { hash, compare } from 'bcrypt';

/*====================== */
/*       ENCRYPT         */
/*====================== */

//encriptar cualquier cosa
export const encrypt = (value) => {
    try {
        return hash(value, 10);
    } catch (err) {
        console.error(err);
        return err;
    }
}

/*====================== */
/*      VALIDATE         */
/*====================== */

//Validar encriptaciones

export const checkEncrypt = async (value, valueEncrypt) => {
    try {
        return await compare(value, valueEncrypt);
    } catch (err) {
        console.error(err);
        return err;
    }
}


/*===================== */
/*       USUARIO        */
/*===================== */

/**
 * Funcion para validar la estructura de un email.
 * @param {String} email 
 * @returns {Boolean} true para estructura valida, false para estructura invalida.
 */
export const checkEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Funcion para validar la longitud minima y maxima de un username
 * @param {String} username 
 * @returns {Boolean} true si username > 5 o false si username < 5
 */
export const checkUsername = (username) => {
    return username.length >= 5;
}

export const checkName = (name) => {
    return name.length >= 5
}

/**
 * Función para validar las contraseñas.
 * @param {String} pass String de contraseña
 * @returns {Boolean} true para contraseña valida, false contraseña inválida.
 */
export const checkPassword = (pass) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/;
    console.log(pass, " - ", typeof pass);
    console.log(passwordRegex.test(pass)); // Esto debería devolver `true` para contraseñas válidas
    return passwordRegex.test(pass);
}


/*===================== */
/*       PRODUCT        */
/*===================== */

/*===================== */
/*        MODEL         */
/*===================== */

/*===================== */
/*        COLOR         */
/*===================== */

/*===================== */
/*      CATEGORY        */
/*===================== */

