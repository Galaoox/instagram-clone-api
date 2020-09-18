import { query } from '../util/common';
export interface ParamsUpdateInfoProfile {
    name: string;
    username: string;
    biography: string;
    webSite: string;
    path: string;
    id: number;
}

export async function updateInfoProfile(data: ParamsUpdateInfoProfile, callback: Function) {
    console.log(data);
    const sql = `UPDATE users SET name =  ? , username =  ?,
    biography =  ?, webSite =  ?, imageUrl = ?  WHERE id = ?`;
    query(sql, [data.name, data.username, data.biography, data.webSite, data.path, data.id], callback);
}

export async function findUserById(idUser: number, callback: Function) {
    const sql = 'SELECT * FROM users where id =  ?';
    query(sql, idUser, callback);
}

