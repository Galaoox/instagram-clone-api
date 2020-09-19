import { Request, Response, NextFunction } from "express";
import { encrypt, comparePassword } from "../util/bcrypt";
import { createToken } from '../util/common';
import { checkUsernameIsUsed, checkEmailIsUsed, registerUser } from "../models/auth.model";
import { findUserByEmail } from "../models/user.model";
import { User } from '../util/models/user';
/**
 * Realiza el registro de un usuario
 * @param req 
 * @param res 
 * @param next 
 */
export const singUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, username, name } = req.body;
        await validateRequestSingUp(res, { email, password, username, name });
        const emailUsed = await checkEmailIsUsed({ email });
        if (emailUsed) return res.status(401).json({ msg: 'El correo electronico ya se encuentra registrado' });
        const usernameUsed = await checkUsernameIsUsed({ username });
        if (usernameUsed) return res.status(401).json({ msg: 'El usuario ingresado ya se encuentra registrado' });
        const data = { name, username, password: await encrypt(password), email }
        const userRegistered: any = await registerUser(data);
        return res.status(201).json({
            msg: 'Usuario creado exitosamente',
            ...authResponseWithToken({ ...data, id: userRegistered.insertId })
        });
    } catch (error) {
        console.log("Auth.controller singUp", error);
        return res.status(401).json({ error });
    }
}
/**
 * Realiza la validacion de los parametros usados en la funcion SingUp
 * @param res 
 * @param params 
 */
function validateRequestSingUp(res: Response, params: { email: string, password: string, username: string, name: string }) {
    if (!params.email || !params.password) {
        return res.status(400).json({ msg: 'Ingrese su correo y su contraseña' });
    } else if (!params.name) {
        return res.status(400).json({ msg: 'Ingrese su nombre' });
    }
    else if (!params.username) {
        return res.status(400).json({ msg: 'Ingrese el usuario' });
    }
}
/**
 * Realiza la autenticacion del usuario
 * @param req 
 * @param res 
 */
export const singIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        await validateRequestSingIn(res, { email, password });
        const user: Partial<User> | null = await findUserByEmail(email);
        if (user) {
            const match = await comparePassword(password, user.password)
            if (match) {
                res.json({
                    msg: "Inicio sessión correctamente",
                    ...authResponseWithToken(user)
                });
            } else {
                res.status(400).json({ msg: "La contraseña es incorrecta" });
            }
        } else {
            return res.status(400).json({ msg: "El correo electronico no existe" });
        }
    } catch (error) {
        console.log(error);
        return res.json({ error });
    }

}
/**
 * Realiza multiples validaciones a los parametros que recibe el metodo SingIn
 * @param res 
 * @param params 
 */
function validateRequestSingIn(res: Response, params: { email: string, password: string }) {
    if (!params.email || !params.password) {
        return res.status(400).json({ msg: 'Ingrese sus correo y su contraseña' });
    }
}

/**
 * Realiza la creacion del JSON  usado para retornar informacion clave para la autenticacion 
 * y visualizacion de la informacion de un usuario
 * @param user informacion necesario para crear el token del usuario
 */
export function authResponseWithToken(user: Partial<User>) {
    return {
        token: createToken({ id: user.id, email: user.email }),
        name: user.name,
        username: user.username,
        imageUrl: user?.imageUrl ?? null,
        biography: user?.biography ?? null,
        webSite: user?.webSite ?? null
    }
}
/**
 * Realiza el proceso de cerrar sesión
 * @param req 
 * @param res 
 */
export function logout(req: Request, res: Response) {
    try {
        req.logOut();
    } catch (error) {
        console.log('logout', error);
    }
}