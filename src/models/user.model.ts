import pool from '../config/database';
import { query } from '../util/common';
export interface ParamsUpdateInfoProfile {
    name: string;
    username: string;
    biography: string;
    webSite: string;
    path: string;
    id: number;
}

export async function updateInfoProfile(dataUser: ParamsUpdateInfoProfile, callback: Function) {
    const sql = `UPDATE users SET name =  ? , username =  ?,
    biography =  ?, webSite =  ?, imageUrl = ?  WHERE id = ?`;
    query(sql, Object.values(dataUser), () => {
        callback();
    })
}

export async function findUserById(idUser: number, callback: Function) {
    const sql = 'SELECT * FROM users where id =  ?';
    query(sql, idUser, () => {
        callback();
    })
}