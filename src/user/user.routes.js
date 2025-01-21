import { Router } from 'express';
import passport from 'passport';
import {
    test, testPasswords, create, read, modifyPersonalCount, modifyOtherCount, deletePersonalAccount, enableAccount,
    recoveryPassword, changePassword,
    confirmAccount
} from './user.controller.js';
import { validateJwt, isAdmin, validateSession, closeSession } from './../middlewares/validate-jwt.js';
const api = Router();

//=========================//
//      Rutas Publicas    //
//=======================//

api.get('/test', test);
api.get('/testPass', testPasswords);
api.post('/register', create);
api.post('/confirm-email/:authorization', confirmAccount);
api.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).send({ message: info.message || 'Credenciales inválidas' });
        if(!user.status && user.confirmEmail != null) return res.status(401).send({message: `Confirma tu cuenta de correo.`});
        if(!user.status && user.confirmEmail == null) return res.status(401).send({message: `Cuenta inhabilitada.`});
        const { token } = info;
        res.cookie('authorization', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 6 * 60 * 60 * 1000, // 6 horas
            path: '/'
        });

        // Puedes personalizar el objeto de respuesta según tus necesidades
        return res.send({
            message: `¡Hola ${user.username}!`,
            token: token,
            role: user.role
        });
    })(req, res, next);
});

api.post('/recovery', recoveryPassword);
api.post('/change-password', changePassword);
api.get('/validateSession', validateSession);
api.get('/closeSession', closeSession);


/*============================ */
/*Rutas Privadas - Compartidas */
/*============================ */
api.put('/modify', [validateJwt], modifyPersonalCount);
api.put('/delete', [validateJwt], deletePersonalAccount);

/*============================== */
/*Rutas Privadas - AdminPlatform */
/*============================== */
api.get('/get', [validateJwt, isAdmin], read);
api.put('/enable/:id', [validateJwt, isAdmin], enableAccount)

export default api;