import Router from 'express';

const router = Router();


router.get('/', (req, res) =>
	res.send('OK')
);



router.post('/pruenas/', (req, res) =>
	res.json({ id: req.body.id })
);

export default router;