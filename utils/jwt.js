'use strict'

import jwt from 'jsonwebtoken';
import { encriptar } from './crypto.js';

export const generateJwt = async (payload) => {
    try {
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '2h',
            algorithm: 'HS256'
        })
        const { iv, encripted } = encriptar(token);
        const autorizationHeader = `${encripted}${process.env.STRONGSECURITY}${iv}`
        return autorizationHeader;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export const generateJwtRecovery = async (payload) => {
    try {
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '50min',
            algorithm: 'HS256'
        });
        return token;
    } catch (err) {
        console.log(err);
        return err;
    }
}