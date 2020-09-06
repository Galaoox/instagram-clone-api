import express, { Request, Response } from "express";
import { IUser } from '../models/user.model';
import pool from '../config/database';
import { comparePassword } from "../util/bcrypt";
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