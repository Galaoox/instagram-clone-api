import { Request, Response } from "express";
import { User } from '../util/models/user';
import pool from '../config/database';
import { comparePassword, encrypt } from "../util/bcrypt";
import { createToken, deleteImage, uploadImage } from '../util/common';
import { ParamsUpdateInfoProfile, updateEmailUser, updateInfoProfile, updatePasswordUser } from '../models/user.model';
import { authResponseWithToken } from './auth.controller';
import { checkUsernameIsUsed } from "../models/auth.model";

/**
 * Retorna la informacion del usuario
 */
export const getDataEditProfile = async (req: Request, res: Response) => {
    try {
        const user: User = req.user as User;
        const data = {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            imageUrl: user.imageUrl,
            biography: user.biography,
            webSite: user.webSite,
        }
        return res.json({ ...data });
    } catch (error) {
        console.log('getDataEditProfile', error);
        return res.status(401).json({ msg: 'Ha ocurrido un error intenta mas tarde' });
    }
}

/**
 *  Modifica el correo electronico del usuario 
 */
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { name, username, biography, webSite, image } = req.body;
        const user: User = req.user as User;
        const path = await uploadImage(image);
        path && deleteImage('./src/' + (<string>user.imageUrl));
        const data = { name, username, biography, path: path ? path : user.imageUrl, id: user.id, webSite } as ParamsUpdateInfoProfile;
        const usernameUsed = await checkUsernameIsUsed({ username, id: user.id });
        if (!usernameUsed) return res.status(401).json({ msg: 'El usuario ingresado ya se encuentra en uso' });
        await updateInfoProfile(data);
        return res.json({
            msg: 'Perfil editado exitosamente',
            ...authResponseWithToken(user)
        });
    } catch (error) {
        console.log("updateProfile" + error);
        return res.status(400).json({ msg: 'Ha ocurrido un error' });
    }
}

/**
 *  Modifica el correo electronico del usuario 
 */
export const updateEmail = async (req: Request, res: Response) => {
    try {
        const { newEmail, password } = req.body;
        valdiateRequestUpdateEmail(res, { newEmail, password });
        const user: User = req.user as User;
        const math = await comparePassword(password, user.password)
        if (math) {
            await updateEmailUser(newEmail, (<number>user.id));
            return res.status(201).json({
                token: createToken({ id: user.id, email: newEmail }),
                name: user.name,
                username: user.username,
                msg: 'Correo electronico editado exitosamente'
            });
        } else {
            return res.status(400).json({ msg: "La contraseña no coincide" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Ha ocurrido un error intenta mas tarde' });
    }
}

function valdiateRequestUpdateEmail(res: Response, params: { newEmail: string, password: string }) {
    if (!params.newEmail) {
        return res.status(400).json({ msg: 'Ingrese el nuevo correo electronico' });
    } else if (!params.password) {
        return res.status(400).json({ msg: 'Ingrese su contraseña' });
    }
}


/**
 *  Modifica la contraseña del usuario
 */
export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { password, newPassword, confirmPassword } = req.body;
        valdiateRequestUpdatePassword(res, { password, newPassword, confirmPassword });
        const user: User = req.user as User;
        const math = await comparePassword(password, user.password)
        if (math) {
            const passwordNew = await encrypt(newPassword);
            await updatePasswordUser(passwordNew, (<number>user.id));
            return res.status(201).json({
                msg: 'Contraseña editada exitosamente'
            });
        } else {
            return res.status(400).json({ msg: "La contraseña no es correcta" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Ha ocurrido un error intenta mas tarde' });
    }
}

function valdiateRequestUpdatePassword(res: Response, params: { password: string, newPassword: string, confirmPassword: string }) {
    if (!params.password) {
        return res.status(400).json({ msg: 'Ingrese su contraseña' });
    } else if (!params.newPassword) {
        return res.status(400).json({ msg: 'Ingrese su nueva contraseña' });
    } else if (!params.confirmPassword) {
        return res.status(400).json({ msg: 'Ingrese su la confirmacion de su contraseña' });
    } else if (params.confirmPassword !== params.newPassword) {
        return res.status(400).json({ msg: 'Las contraseñas no coinciden' });
    }
}

