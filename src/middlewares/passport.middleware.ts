import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import config from '../config/keys';
import pool from '../config/database';
import { IUser } from '../models/user.model';


const opciones: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
};

export default new Strategy(opciones, async (payload, done) => {
    try {
        await pool.query('SELECT * FROM users where id =  ?', payload.id,
            (error, results, fields) => {
                if (error) { console.log(error); }
                if (results[0]) {
                    const user: IUser = results[0]
                    if (user) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                }
            });

    } catch (error) {
        console.log(error);

    }
});