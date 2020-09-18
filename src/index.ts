import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import cors from 'cors';
import passportMiddleware from './middlewares/passport.middleware';
import indexRoutes from './index.routes';
import path from 'path';


// Inicializo la app
const app = express();

// Midlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '15MB' }));
app.use(passport.initialize());
passport.use(passportMiddleware);

// Routes
app.use(indexRoutes);

// Config
app.use('/uploads', express.static(path.join(__dirname + '/uploads')));


export default app;