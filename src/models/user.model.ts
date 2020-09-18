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

export async function updateInfoProfile(data: ParamsUpdateInfoProfile) {

    const paramsEdit = {
        name: data.name, username: data.username, biography: data.biography, webSite: data.webSite, imageUrl: data.path,
    }
    return await generalUpdate('users', paramsEdit, { id: data.id });
}

export async function findUserById(id: number): Promise<Partial<User> | null> {
    return await findBy('users', { id });
}
export async function findUserByEmail(email: string): Promise<Partial<User> | null> {
    return await findBy('users', { email });
}

export async function updateEmailUser(email: string, id: number) {
    return await generalUpdate('users', { email }, { id });
}

export async function updatePasswordUser(password: string, id: number) {
    return await generalUpdate('users', { password }, { id });
}





