import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import config from '../config/keys';
import pool from '../config/database';
import { User } from '../util/models/user.model';
import { findUserById } from '../models/user.model';


const opciones: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
};

export default new Strategy(opciones, async (payload, done) => {
    try {

        findUserById(payload.id as number, (results: any) => {
            const user: User | null = (<Array<any>>results).length ? results[0] : null;
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });

    } catch (error) {
        console.log(error);
    }
});