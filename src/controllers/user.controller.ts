import { NextFunction, Request, Response} from 'express';
const UserModel = require('../models/user.models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

class UserController {

    getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            let listUser = await UserModel.find({ activo : 1});

            if (!listUser.length) {
                return res.status(404).json({
                    ok: false, 
                    error: {
                        message: 'No se encontraron usuarios'
                    }
                })            
            }

            listUser = listUser.map((user: any) => {
                const { contrasena, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });

            res.status(200).json({
                ok: true,
                data: listUser
            })

        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }
    };


    getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            let user = await UserModel.findOne({ id_usuario : req.params.id });

            if (!user) {
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'No se encontró usuario'
                    }
                })
            }

            const { contrasena, ...userWithoutPassword} = user;

            res.json({
                ok: true,
                data: userWithoutPassword
            });
            

        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }
    };


    createUser = async(req: Request, res: Response, next: NextFunction ) => {

        try {
            
            await this.codificarPassword(req);

            const exist = await UserModel.findOne({correo : req.body.correo});

            if(!exist){

                const result = await UserModel.create(req.body);

                if(!result){
                    return res.status(500).json({
                        ok: false, 
                        error: {
                            message: 'Error al crear usuario.'
                        }
                    })
                }

                res.status(201).json({
                    ok: true, 
                    message: 'Usuario creado correctamente'
                })

            } else {

                return res.status(500).json({
                    ok: false, 
                    error: {
                        message: 'El usuario ya está registrado en la BD.'
                    }
                })
            }            

        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }

    }


    updateUser = async(req: Request, res: Response, next: NextFunction) => {

        try {
            
            const result = await UserModel.update(req.body, req.params.id);

            if(!result){
                return res.status(404).json({
                    ok: false,
                    error:{
                        message: 'Ha ocurrido un error'
                    }
                })
            }

            const { affectedRows, info } = result;

            if (!affectedRows){
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'usuario no existe',
                        info
                    }
                })
            }

            res.status(200).json({ 
                ok: true,
                message: 'Usuario actualizado correctamente', 
                info 
            });

        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }
    }


    enableDisableUser = async(req: Request, res: Response, next: NextFunction) => {

        try {
            
            const result = await UserModel.enableDisable(req.body, req.params.id);

            if(!result){
                return res.status(404).json({
                    ok: false,
                    error:{
                        message: 'Ha ocurrido un error'
                    }
                })
            }

            const { affectedRows, info } = result;

            if (!affectedRows){
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Usuario no existe',
                        info
                    }
                })
            }

            res.status(200).json({ 
                ok: true,
                message: 'Estatus usuario actualizado correctamente', 
                info 
            });

        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }
    }


    changePassword = async(req: Request, res: Response, next: NextFunction) => {

        try {

            await this.codificarPassword(req);
            
            const result = await UserModel.changePassword(req.body, req.params.id);

            if(!result){
                return res.status(404).json({
                    ok: false,
                    error:{
                        message: 'Ha ocurrido un error'
                    }
                })
            }

            const { affectedRows, info } = result;

            if (!affectedRows){
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Usuario no existe',
                        info
                    }
                })
            }

            res.status(200).json({ 
                ok: true,
                message: 'Contraseña actualizado correctamente', 
                info 
            });

        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }
    }


    userLogin = async (req: Request, res: Response, next: NextFunction) => {
        
        try {
            
            //this.checkValidation(req, next);

            const { correo, contrasena: pass } = req.body;

            const user = await UserModel.findOne({ correo });

            if (!user) {
                return res.status(401).json({
                    ok: false, 
                    error: {
                        message: 'No se encontró usuario.'
                    }
                })
            }

            const isMatch = await bcrypt.compareSync(pass, user.contrasena);

            if (!isMatch) {
                //throw new HttpException(401, 'Incorrect password!');
                return res.status(401).json({
                    ok: false, 
                    error: {
                        message: 'Contraseña incorrecta'
                    }
                })
            }

            
            // user matched!
            const secretKey = process.env.SECRET_JWT || "";
            const token = jwt.sign({ user_id: user.id_usuario.toString() }, secretKey, {
                expiresIn: '24h'
            });

            const { contrasena, ...userWithoutPassword } = user;

            //res.send({ ...userWithoutPassword, token });
            res.status(200).json({
                ok: true,
                ...userWithoutPassword,
                token
            })

        } catch (error) {
            next(`No se ha podido procesar el request ${error}`)
        }        
    }



    codificarPassword = async (req: Request) => {

        if(req.body.contrasena) {
            req.body.contrasena = await bcrypt.hashSync(req.body.contrasena, 10)
        }

    }

    // checkValidation = async (req: Request, next: NextFunction) => {

    //     const errors = validationResult(req)

    //     console.log(errors.Result);

    //     if (!errors.isEmpty()) {
    //         //throw new HttpException(400, 'Validation faild', errors);
    //         next( new ErrorResponse(`Validacion fallida`, 400, errors.Result))

            
    //     }
    // }

}

module.exports = new UserController;
