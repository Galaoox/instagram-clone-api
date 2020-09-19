import bcrypt from 'bcrypt';
/**
 * Realiza la encriptacion de la contraseña del usuario
 * @param password contraseña sin encriptar del usuario
 */
export async function encrypt(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

/**
 * Realiza la comparacion entre la contraseña no encriptada del usuario con la encriptada
 * @param password contraseña ingresada por el usuario
 * @param passwordBd contraseña encriptada del usuario
 */
export async function comparePassword(password: string, passwordBd: string = ''): Promise<Boolean> {
    return password && passwordBd ? await bcrypt.compare(password, passwordBd) : false;
}