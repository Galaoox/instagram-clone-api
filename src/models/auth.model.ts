import { User } from '../util/models/user';
import pool from '../config/database';
import { checkColumnValueIsUsedQuery, consult, generalInsert } from './model';

/**
 * Realiza una verificacion del usuario para saber si un correo electronico es usado
 * @param user informacion usada para comprobar los datos del usuario
 */
export async function checkUsernameIsUsed(user: { username: string, id?: number }) {
    try {
        const sql = checkColumnValueIsUsedQuery('users', 'username', !!user.id);
        const used: any = await pool.query(sql, Object.values(user))
        return isUsed(used);
    } catch (error) {
        console.log("checkUsernameIsUsed", error);
    }

}

/**
 * Realiza una verificacion del correo eletronico para saber si un correo electronico es usado
 * @param user informacion usada para comprobar los datos del usuario
 */
export async function checkEmailIsUsed(user: { email: string, id?: number }) {
    try {
        const sql = checkColumnValueIsUsedQuery('users', 'email', !!user.id);
        const used: any = await consult(sql, Object.values(user));
        return isUsed(used);
    } catch (error) {
        console.log("checkEmailIsUsed", error);

    }
}

/**
 * Realiza una condicion generica apartir de los resultados de una consulta indicando si existe o no un registro
 * @param result resultados de la consulta donde se valida si existe o no un registro con la condicion indicada en la consulta
 */
function isUsed(result: Array<any>) {
    console.log(result?.length, result[0]?.count, result?.length && result[0]?.count > 0);
    return (result?.length && result[0]?.count > 0);
}

/**
 * Realiza el registro de un usuario
 * @param user Datos necesarios para registrar un usuario
 */
export async function registerUser(user: Partial<User>) {
    return generalInsert('users', user);
}
