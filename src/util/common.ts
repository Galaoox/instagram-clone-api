import { User } from './models/user';
import jwt from 'jsonwebtoken';
import config from '../config/keys';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export function createToken(user: Partial<User>) {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret);
}
/**
 * elimina el archivo de la ruta
 * @param path ruta en la que se localiza el archivo
 */
export function deleteImage(path: string) {
    try {

        if (fs.existsSync(path)) {
            fs.unlinkSync(path)
        }
    } catch (error) {
        console.error(error)
    }
}
/**
 * Realiza la subida(creacion) de un archivo en este caso en base64
 * @param image JSON que contiene el tipo de imagen y el archivo en base64
 */
export async function uploadImage(image: { type: string, base64: string }) {
    if (image) {
        const filePath = image ? "uploads/" + uuidv4() + '.' + image.type : null;
        try {
            fs.writeFile(`./src/${filePath}`, image.base64, 'base64', (err) => {
                if (err) throw err
            });
            return filePath;
        } catch (error) {
            console.error(error)

        }
    }
    return null;
}