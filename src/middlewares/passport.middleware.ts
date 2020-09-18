import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import config from '../config/keys';
import { findUserById } from '../models/user.model';

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
};

export default new Strategy(options, async (payload, done) => {
    try {
        const user = await findUserById(payload.id as number);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        console.log("Passport" + error);
    }
});