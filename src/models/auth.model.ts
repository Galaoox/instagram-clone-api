import { User } from '../util/models/user';
import pool from '../config/database';
import { checkColumnValueIsUsedQuery, consult, generalInsert } from './model';


export async function checkUsernameIsUsed(user: { username: string, id?: number }) {
    try {
        const sql = checkColumnValueIsUsedQuery('users', 'username', !!user.id);
        const used: any = await pool.query(sql, Object.values(user))
        return isUsed(used);
    } catch (error) {
        console.log("checkUsernameIsUsed", error);
    }

}

export async function checkEmailIsUsed(user: { email: string, id?: number }) {
    try {
        const sql = checkColumnValueIsUsedQuery('users', 'email', !!user.id);
        const used: any = await consult(sql, Object.values(user));
        return isUsed(used);
    } catch (error) {
        console.log("checkEmailIsUsed", error);

    }
}

function isUsed(result: Array<any>) {
    return (result?.length && result[0]?.count > 0);
}



export async function registerUser(user: Partial<User>) {
    return generalInsert('users', user);
}
