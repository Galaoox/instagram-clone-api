import express, { Request, Response } from "express";
import { User } from '../util/models/user';
import pool from '../config/database';
import { encrypt, comparePassword } from "../util/bcrypt";
import { createToken } from '../util/common';
import { checkUsernameIsUsed, checkEmailIsUsed, registerUser } from "../models/auth.model";




/**
 * Crea un usuario y realiza validaciones sobre los datos
 */
export const singUp = async (req: Request, res: Response) => {
    try {
        const { email, password, username, name } = req.body;
        validateRequestsingUp(res, { email, password, username, name });
        await checkEmailIsUsed({ email, }, (results: any) => {
            const user = (<Array<any>>results).length ? results[0] : null;
            if (user) res.sendStatus(401).json({ msg: 'El correo electronico ya se encuentra registrado' });
        })
        await checkUsernameIsUsed({ username, }, (results: any) => {
            const user = (<Array<any>>results).length ? results[0] : null;
            if (user) res.sendStatus(401).json({ msg: 'El usuario ingresado ya se encuentra registrado' });
        })
        const data = { name, username, password: await encrypt(password), email }
        await registerUser(data, (results: any) => {
            return res.status(201).json({
                token: createToken({ id: results.insertId, email: data.email }),
                name: data.name,
                username: data.username,
                msg: 'Usuario creado exitosamente'
            });
        });
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

function validateRequestsingUp(res: Response, params: { email: string, password: string, username: string, name: string }) {
    if (!params.email || !params.password) {
        return res.status(400).json({ msg: 'Ingrese su correo y su contraseña' });
    } else if (!params.name) {
        return res.status(400).json({ msg: 'Ingrese su nombre' });
    }
    else if (!params.username) {
        return res.status(400).json({ msg: 'Ingrese el usuario' });
    }
}


// iniciar sesion

export const singIn = async (req: Request, res: Response) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ msg: 'Ingrese sus correo y su contraseña' });
        }
        console.log(req.body);
        /**
         * Valido que exista el email en la bd
         */
        await pool.query('SELECT * FROM users where email =  ?', req.body.email,
            async (error, results, fields) => {
                if (error) { console.log(error); }
                if (results[0]) {
                    const user: User = results[0];
                    if (!user) {
                        return res.status(400).json({ msg: "El correo electronico no existe" });
                    } else {
                        const match = await comparePassword(req.body.password, user.password)
                        if (match) {
                            res.json({
                                token: createToken({ id: user.id, email: user.email }),
                                name: user.name,
                                username: user.username,
                                msg: "Inicio sessión correctamente"
                            });
                        } else {
                            res.status(400).json({ msg: "La contraseña no coincide" });
                        }
                    }
                }
            });



    } catch (error) {
        console.log(error);
        res.json({ error });
    }

}