import { Router } from 'express';
import { singIn, singUp } from '../controllers/auth.controller';

const router: Router = Router();

// crear usuario
router.post('/singup', singUp);
// iniciar sesion
router.post('/singin', singIn);


export default router;
