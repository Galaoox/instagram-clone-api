import { consult, findBy, generalUpdate } from './model';
import { User } from '../util/models/user';
export interface ParamsUpdateInfoProfile {
    name: string;
    username: string;
    biography: string;
    webSite: string;
    path: string;
    id: number;
}
/**
 * Realiza una actualizacion de la informacion no sensible del usuario
 * @param data datos usados para actualizar informacion no sensible del usuario
 */
export async function updateInfoProfile(data: ParamsUpdateInfoProfile) {

    const paramsEdit = {
        name: data.name, username: data.username, biography: data.biography, webSite: data.webSite, imageUrl: data.path,
    }
    return await generalUpdate('users', paramsEdit, { id: data.id });
}
/**
 * Realiza una busqueda de usuarios apartir del id
 * @param id id del usuario
 */
export async function findUserById(id: number): Promise<Partial<User> | null> {
    return await findBy('users', { id });
}
/**
 * Realiza una busqueda de usuarios apartir del correo electronico
 * @param email correo electronico del usuario
 */
export async function findUserByEmail(email: string): Promise<Partial<User> | null> {
    return await findBy('users', { email });
}
/**
 * Realiza la actualizacion del correo electronico del usuario
 * @param email correo electronico del usuario
 * @param id id del usuario
 */
export async function updateEmailUser(email: string, id: number) {
    return await generalUpdate('users', { email }, { id });
}
/**
 * Realiza la actualizacion de la contraseña de un usuario
 * @param password contraseña del usuario
 * @param id id del usuario
 */
export async function updatePasswordUser(password: string, id: number) {
    return await generalUpdate('users', { password }, { id });
}





