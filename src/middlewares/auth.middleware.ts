import { Request, Response, NextFunction} from 'express';
const ErrorResponse = require('../utils/error.utils');
const UserModel = require('../models/user.models');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

declare module "express" { 
    export interface Request {
        usuario: any,
        
    }
}

let checkToken = async (req: Request, res: Response, next: NextFunction) => {

    // Obtener el header, se llama token en este caso.
    const token = req.headers.token;

    if (!token){
        return res.status(401).json({
            ok: false,
            err: 'Acceso denegado. ¡No se enviaron credenciales!'
        })
    }

    await jwt.verify( token, process.env.SECRET_JWT, (err: Error, user: any) => {

        if(err){
            return res.status(401).json({
                ok: false,
                err: 'Token Inválido'
            })
        }

       req.usuario = user;
        
       next();   

    }) 

}


let checkAdminRole = async (req: Request, res: Response, next: NextFunction) => {

    let usuario = req.usuario;

    const user = await UserModel.findOne({ id_usuario: usuario.user_id });

    // 1 = Admin
    if(user.rol === 1){

        next();
    
    } else{
        return res.json({
            ok: false,
            err: {
                message: 'No tiene permisos para esta operacion'
            }
        });
    }
}

/*
let auth = (...roles: any) => {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers.authorization;

            console.log(authHeader);

            const bearer = 'Bearer ';

            //if (!authHeader || !authHeader.startsWith(bearer)) {
            if (!authHeader) {
                //throw new ErrorResponse(401, 'Access denied. No credentials sent!');
                return res.status(401).json({
                    ok: false,
                    error: {
                        mensaje: 'Acceso denegado. ¡No se enviaron credenciales!'
                    }
                })
            }

            const token = authHeader.replace(bearer, '');
            const secretKey = process.env.SECRET_JWT || "";

            // Verify Token
            const decoded = jwt.verify(token, secretKey);
            const user = await UserModel.findOne({ id_usuario: decoded.user_id });

            if (!user) {
                throw new ErrorResponse(401, 'Authentication failed!');
            }

            // check if the current user is the owner user
            const ownerAuthorized = req.params.id == user.id;

            // if the current user is not the owner and
            // if the user role don't have the permission to do this action.
            // the user will get this error
            if (!ownerAuthorized && roles.length && !roles.includes(user.role)) {
                throw new ErrorResponse(401, 'Unauthorized');
            }

            // if the user has permissions
            //req.currentUser = user;
            next();

        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}
*/

module.exports = {
    checkToken,
    checkAdminRole
};
