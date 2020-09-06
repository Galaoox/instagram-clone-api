import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import cors from 'cors';
import passportMiddleware from './middlewares/passport.middleware';
import indexRoutes from './index.routes';


// Inicializo la app
const app = express();



// Midlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
passport.use(passportMiddleware);

// Routes
app.use(indexRoutes);

// Config


export default app;