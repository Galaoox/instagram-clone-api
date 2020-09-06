import { IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';
import config from '../config/keys';

export function createToken(user: Partial<IUser>) {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret);
}