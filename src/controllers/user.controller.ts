import { Request, Response } from "express";
import { User } from '../util/models/user';
import pool from '../config/database';
import { comparePassword, encrypt } from "../util/bcrypt";
import { createToken } from '../util/common';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { updateInfoProfile, ParamsUpdateInfoProfile, } from '../models/user.model';
import { checkUsernameIsUsed } from '../models/auth.model';





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

        res.json({ ...data });
    } catch (error) {
        console.log(error);
        res.sendStatus(401).json({ msg: 'Ha ocurrido un error intenta mas tarde' });
    }

}


/**
 *  Modifica el correo electronico del usuario 
 */
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const {
            name,
            username,
            biography,
            webSite,
            image
        } = req.body;
        const user: User = req.user as User;
        const path = await uploadImage(image);
        path && deleteImage('./src/' + (<string>user.imageUrl));
        const data = {
            name, username, biography, path: path ? path : user.imageUrl, id: user.id, webSite
        } as ParamsUpdateInfoProfile;
        await checkUsernameIsUsed({ username, id: user.id }, (results: any) => {
            const user = (<Array<any>>results).length ? results[0] : null;
            if (user) res.sendStatus(401).json({ msg: 'El usuario ingresado ya se encuentra en uso' });
        })
        await updateInfoProfile(data, () => {
            res.json({
                msg: 'Perfil editado exitosamente'
            });
        })

    } catch (error) {
        console.log("function updateProfile" + error);
        res.sendStatus(400).json({ msg: 'Ha ocurrido un error' });
    }
}

async function uploadImage(image: { typeImage: string, base64: string }) {
    if (image) {
        const filePath = image ? "uploads/" + uuidv4() + '.' + image.typeImage : null;
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

function deleteImage(path: string) {
    try {
        fs.unlinkSync(path)
    } catch (error) {
        console.error(error)
    }
}


/**
 *  Modifica el correo electronico del usuario 
 */
export const updateEmail = async (req: Request, res: Response) => {
    try {
        if (!req.body.newEmail) {
            return res.status(400).json({ msg: 'Ingrese el nuevo correo electronico' });
        } else if (!req.body.password) {
            return res.status(400).json({ msg: 'Ingrese su contraseña' });
        }
        const user: User = req.user as User;
        const math = await comparePassword(req.body.password, user.password)
        if (math) {
            const sql = "UPDATE users SET email =  ? WHERE id = ?";
            await pool.query(sql, [req.body.newEmail, user.id],
                (error, results, fields) => {
                    if (error) { console.log(error); }
                    if (results) {
                        return res.status(201).json({
                            token: createToken({ id: results.insertId, email: req.body.newEmail }),
                            name: user.name,
                            username: user.username,
                            msg: 'Correo electronico editado exitosamente'
                        });
                    }
                });


        } else {
            return res.status(400).json({ msg: "La contraseña no coincide" });
        }



    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Ha ocurrido un error intenta mas tarde' });
    }
}
/**
 *  Modifica la contraseña del usuario
 */
export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { password, newPassword, confirmPassword } = req.body;
        if (!password) {
            return res.status(400).json({ msg: 'Ingrese su contraseña' });
        } else if (!newPassword) {
            return res.status(400).json({ msg: 'Ingrese su nueva contraseña' });
        } else if (!confirmPassword) {
            return res.status(400).json({ msg: 'Ingrese su la confirmacion de su contraseña' });
        } else if (confirmPassword !== newPassword) {
            return res.status(400).json({ msg: 'Las contraseñas no coinciden' });
        }
        const user: User = req.user as User;
        const math = await comparePassword(password, user.password)
        if (math) {
            const passwordNew = await encrypt(newPassword);
            const sql = "UPDATE users SET password =  ? WHERE id = ?";
            await pool.query(sql, [passwordNew, user.id],
                (error, results, fields) => {
                    if (error) { console.log(error); }
                    if (results) {
                        return res.status(201).json({
                            msg: 'Contraseña editada exitosamente'
                        });
                    }
                });


        } else {
            return res.status(400).json({ msg: "La contraseña no es correcta" });
        }



    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Ha ocurrido un error intenta mas tarde' });
    }
}


