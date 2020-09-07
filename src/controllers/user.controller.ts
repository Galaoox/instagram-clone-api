import express, { Request, Response } from "express";
import { IUser } from '../models/user.model';
import pool from '../config/database';
import { comparePassword, encrypt } from "../util/bcrypt";
import { createToken } from '../util/common';


/**
 * Retorna la informacion del usuario
 */
export const getDataEditProfile = async (req: Request, res: Response) => {
    try {
        res.json({ ...req.user });
    } catch (error) {
        console.log(error);
        res.json({ error });
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
        const user: IUser = req.user as IUser;
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
        res.status(400).json({ error });
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
        const user: IUser = req.user as IUser;
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
        res.status(400).json({ error });
    }
}