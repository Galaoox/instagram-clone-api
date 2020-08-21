import Router from 'express';

const router = Router();

// route para probar que la api este funcionando
router.get('/', (req, res) =>
    res.send('OK')
);

export default router;