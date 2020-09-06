import Router from 'express';
const router = Router();
import AuthRoutes from './routes/auth.route';


router.get('/', (req, res) =>
	res.send('OK')
);
router.use('/auth', AuthRoutes);


export default router;