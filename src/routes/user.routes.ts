import { Router } from 'express';
import passport from 'passport';
import upload from '../util/multer';
import { getDataEditProfile, updateEmail, updatePassword, updateProfile, getUsers } from '../controllers/user.controller';
const router: Router = Router();

// editar usuario
router.put('/editProfile',
    passport.authenticate('jwt', { session: false }),
    updateProfile);

// mostrar informacion usuario al editar
router.get('/showDataEdit',
    passport.authenticate('jwt', { session: false }),
    getDataEditProfile);
// actualizar correo electronico del usuario
router.put('/updateEmail',
    passport.authenticate('jwt', { session: false }),
    updateEmail);
// actualizar contraseña del usuario
router.put('/updatePassword',
    passport.authenticate('jwt', { session: false }),
    updatePassword);

router.get('/getUsers',
    passport.authenticate('jwt', { session: false }),
    getUsers);

export default router;
