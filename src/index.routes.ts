import Router from 'express';
const router = Router();
import AuthRoutes from './routes/auth.routes';
import UserRoutes from './routes/user.routes';



router.get('/', (req, res) =>
	res.send('OK')
);
router.use('/auth', AuthRoutes);
router.use('/user', UserRoutes);


export default router;