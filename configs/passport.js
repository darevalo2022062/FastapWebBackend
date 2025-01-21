// passport.js

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local'; // Asegúrate de que este import es correcto
import User from '../src/user/user.model.js';
import { checkEncrypt } from "../utils/validator.js";
import { generateJwt } from "../utils/jwt.js"; // Importa la función para generar JWT

// Configuración de la estrategia local
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    try {
        const user = await User.findOne({ $or: [{ username }, { email: username }] });
        if (!user) return done(null, false, { message: 'Credenciales inválidas.' });

        const isMatch = await checkEncrypt(password, user.password);
        if (!isMatch) return done(null, false, { message: 'Credenciales inválidas' });

        // Genera el JWT
        const token = await generateJwt({ uid: user._id, username: user.username, name: user.name });

        return done(null, user, { token }); // Devuelve el usuario y el token
    } catch (err) {
        return done(err);
    }
}));

// Serialización para la sesión
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialización para la sesión
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
