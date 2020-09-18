import { User } from './models/user';
import jwt from 'jsonwebtoken';
import config from '../config/keys';

export function createToken(user: Partial<User>) {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret);
}
