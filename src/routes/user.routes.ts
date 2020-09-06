import { Router } from 'express';
import passport from 'passport';
import upload from '../util/multer';
import { getDataEditProfile, updateEmail } from '../controllers/user.controller';
const router: Router = Router();

// editar usuario
// router.post('/showDataEdit',
//     passport.authenticate('jwt', { session: false }),
//     upload.single('image'),
//     getDataEditProfile);

// mostrar informacion usuario al editar
router.get('/showDataEdit',
    passport.authenticate('jwt', { session: false }),
    getDataEditProfile);
// actualizar correo electronico del usuario
router.put('/updateEmail',
    passport.authenticate('jwt', { session: false }),
    updateEmail);

export default router;
