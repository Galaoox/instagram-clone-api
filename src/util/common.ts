import { User } from './models/user';
import jwt from 'jsonwebtoken';
import config from '../config/keys';
import pool from '../config/database';

export function createToken(user: Partial<User>) {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret);
}

export async function query(sql: string, params: JSON | Object | Array<any> | null, callback: Function) {
    await pool.query(sql, params, (error, results, fields) => {
        if (error) { console.log(error); }
        if (results) {
            callback(results);
        }
    });
}