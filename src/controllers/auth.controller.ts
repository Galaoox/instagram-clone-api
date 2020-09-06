import express, { Request, Response } from "express";
import { IUser } from '../models/user.model';
import pool from '../config/database';
import { encrypt, comparePassword } from "../util/bcrypt";
import { createToken } from '../util/common';




/**
 * Crea un usuario y realiza validaciones sobre los datos
 */
export const singUp = async (req: Request, res: Response) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ msg: 'Ingrese su correo y su contraseña' });
        } else if (!req.body.name) {
            return res.status(400).json({ msg: 'Ingrese su nombre' });
        }
        else if (!req.body.username) {
            return res.status(400).json({ msg: 'Ingrese el usuario' });
        }
        /**
         * Valido que el email no este usado
         */
        await pool.query('SELECT * FROM users where email =  ?', req.body.email,
            (error, results, fields) => {
                if (error) { console.log(error); }
                if (results[0]) {
                    const user = results;
                    if (user) {
                        console.log(results[0], "pruebas");

                        return res.status(400).json({ msg: 'El email ya se encuentra registrado' });
                    }
                }
            });

        /**
         * Valido que el username no este usado
         */
        await pool.query('SELECT * FROM users where username =  ?', req.body.username,
            (error, results, fields) => {
                if (error) { console.log(error); }
                if (results[0]) {
                    const user = results[0];
                    if (user) {
                        return res.status(400).json({ msg: 'El username ya se encuentra registrado' });
                    }
                }
            });

        const data = await {
            name: req.body.name,
            username: req.body.username,
            password: await encrypt(req.body.password),
            email: req.body.email

        }

        /**
         * Realiza la creacion del usuario en la bd y genera el token y retorna los datos del usuario y el token
         */
        await pool.query('INSERT INTO users SET ? ', [data],
            (error, results, fields) => {
                if (error) { console.log(error); }
                if (results) {
                    console.log(results);
                    return res.status(201).json({
                        token: createToken({ id: results.insertId, email: data.email }),
                        name: data.name,
                        username: data.username,
                        msg: 'Usuario creado exitosamente'
                    });
                }
            });




    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}
// iniciar sesion

export const singIn = async (req: Request, res: Response) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ msg: 'Ingrese sus correo y su contraseña' });
        }
        /**
         * Valido que exista el email en la bd
         */
        await pool.query('SELECT * FROM users where email =  ?', req.body.email,
            async (error, results, fields) => {
                if (error) { console.log(error); }
                if (results[0]) {
                    const user: IUser = results[0];
                    if (!user) {
                        return res.status(400).json({ msg: "El correo electronico no existe" });
                    } else {
                        const match = await comparePassword(req.body.password, user.password)

                        if (match) {
                            return res.status(200).json({
                                token: createToken({ id: user.id, email: user.email }),
                                name: user.name,
                                username: user.username,
                                msg: "Inicio sessión correctamente"
                            });
                        } else {
                            return res.status(400).json({ msg: "La contraseña no coincide" });
                        }
                    }
                }
            });



    } catch (error) {
        console.log(error);
        res.json({ error });
    }

}