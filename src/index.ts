import express, { Request, Response, Router } from 'express';
import morgan from 'morgan';
import passport from 'passport';
import cors from 'cors';
// import passportMiddleware from './middlewares/passport';
import indexRoutes from './index.routes';

// Inicializo la app
const app = express();



// Midlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
// passport.use(passportMiddleware); TODO: descomentar esta linea de codigo para el passport con jwt

// Routes
app.use(indexRoutes);

// Config


export default app;