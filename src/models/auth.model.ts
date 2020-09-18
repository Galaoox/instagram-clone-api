import { query } from '../util/common';
import { User } from '../util/models/user';

export async function checkUsernameIsUsed(user: { username: string, id?: number }, callback: Function) {
    const condition = 'AND id != ?'
    const sql = `SELECT * FROM users WHERE username =  ? ${user.id ? condition : ''}`;
    query(sql, Object.values(user), callback)
}

export async function checkEmailIsUsed(user: { email: string, id?: number }, callback: Function) {
    const condition = 'AND id != ?'
    const sql = `SELECT * FROM users WHERE email =  ? ${user.id ? condition : ''}`;
    query(sql, Object.values(user), callback)
}

export async function registerUser(user: Partial<User>, callback: Function) {
    const sql = 'INSERT INTO users SET ? ';
    query(sql, user, callback);
}
