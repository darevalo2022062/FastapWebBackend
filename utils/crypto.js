import crypto from 'crypto';

const algoritmo = 'aes-256-cbc';
// Estas claves deben ser gestionadas adecuadamente en un entorno seguro.
const key = crypto.randomBytes(32); // Llave secreta
const iv = crypto.randomBytes(16);  // Vector de inicialización

export const encriptar = (jwt) => {
    const cipher = crypto.createCipheriv(algoritmo, key, iv);
    const encripted = Buffer.concat([cipher.update(jwt, 'utf8'), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        encripted: encripted.toString('hex')
    };
};

export const decript = (encriptedJwt) => {
    try {
        const decipher = crypto.createDecipheriv(algoritmo, key, Buffer.from(encriptedJwt.iv, 'hex'));
        const decripted = Buffer.concat([
            decipher.update(Buffer.from(encriptedJwt.encripted, 'hex')),
            decipher.final()
        ]);
        return decripted.toString('utf8');
    } catch (err) {
        if (err.code === 'ERR_OSSL_BAD_DECRYPT') return false;
    }
};