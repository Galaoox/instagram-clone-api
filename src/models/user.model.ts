import pool from '../config/database';
import { findBy } from './model';
import { User } from '../util/models/user';
export interface ParamsUpdateInfoProfile {
    name: string;
    username: string;
    biography: string;
    webSite: string;
    path: string;
    id: number;
}

export async function updateInfoProfile(data: ParamsUpdateInfoProfile) {
    const sql = `UPDATE users SET name =  ? , username =  ?,
    biography =  ?, webSite =  ?, imageUrl = ?  WHERE id = ?`;
    return await pool.query(sql, [data.name, data.username, data.biography, data.webSite, data.path, data.id]);
}

export async function findUserById(id: number): Promise<Partial<User> | null> {
    return await findBy('users', { id });
}
export async function findUserByEmail(email: string): Promise<Partial<User> | null> {
    return await findBy('users', { email });
}





