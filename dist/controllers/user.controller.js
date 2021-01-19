"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel = require('../models/user.models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
class UserController {
    constructor() {
        this.getAllUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let listUser = yield UserModel.find({ activo: 1 });
                if (!listUser.length) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'No se encontraron usuarios'
                        }
                    });
                }
                listUser = listUser.map((user) => {
                    const { contrasena } = user, userWithoutPassword = __rest(user, ["contrasena"]);
                    return userWithoutPassword;
                });
                res.status(200).json({
                    ok: true,
                    data: listUser
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.getUserById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield UserModel.findOne({ id_usuario: req.params.id });
                if (!user) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'No se encontró usuario'
                        }
                    });
                }
                const { contrasena } = user, userWithoutPassword = __rest(user, ["contrasena"]);
                res.json({
                    ok: true,
                    data: userWithoutPassword
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.createUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.codificarPassword(req);
                const exist = yield UserModel.findOne({ correo: req.body.correo });
                if (!exist) {
                    const result = yield UserModel.create(req.body);
                    if (!result) {
                        return res.status(500).json({
                            ok: false,
                            error: {
                                message: 'Error al crear usuario.'
                            }
                        });
                    }
                    res.status(201).json({
                        ok: true,
                        message: 'Usuario creado correctamente'
                    });
                }
                else {
                    return res.status(500).json({
                        ok: false,
                        error: {
                            message: 'El usuario ya está registrado en la BD.'
                        }
                    });
                }
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.updateUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield UserModel.update(req.body, req.params.id);
                if (!result) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'Ha ocurrido un error'
                        }
                    });
                }
                const { affectedRows, info } = result;
                if (!affectedRows) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'usuario no existe',
                            info
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    message: 'Usuario actualizado correctamente',
                    info
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.enableDisableUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield UserModel.enableDisable(req.body, req.params.id);
                if (!result) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'Ha ocurrido un error'
                        }
                    });
                }
                const { affectedRows, info } = result;
                if (!affectedRows) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'Usuario no existe',
                            info
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    message: 'Estatus usuario actualizado correctamente',
                    info
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.changePassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.codificarPassword(req);
                const result = yield UserModel.changePassword(req.body, req.params.id);
                if (!result) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'Ha ocurrido un error'
                        }
                    });
                }
                const { affectedRows, info } = result;
                if (!affectedRows) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'Usuario no existe',
                            info
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    message: 'Contraseña actualizado correctamente',
                    info
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.userLogin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                //this.checkValidation(req, next);
                const { correo, contrasena: pass } = req.body;
                const user = yield UserModel.findOne({ correo });
                if (!user) {
                    return res.status(401).json({
                        ok: false,
                        error: {
                            message: 'No se encontró usuario.'
                        }
                    });
                }
                const isMatch = yield bcrypt.compareSync(pass, user.contrasena);
                if (!isMatch) {
                    //throw new HttpException(401, 'Incorrect password!');
                    return res.status(401).json({
                        ok: false,
                        error: {
                            message: 'Contraseña incorrecta'
                        }
                    });
                }
                // user matched!
                const secretKey = process.env.SECRET_JWT || "";
                const token = jwt.sign({ user_id: user.id_usuario.toString() }, secretKey, {
                    expiresIn: '24h'
                });
                const { contrasena } = user, userWithoutPassword = __rest(user, ["contrasena"]);
                //res.send({ ...userWithoutPassword, token });
                res.status(200).json(Object.assign(Object.assign({ ok: true }, userWithoutPassword), { token }));
            }
            catch (error) {
                next(`No se ha podido procesar el request ${error}`);
            }
        });
        this.codificarPassword = (req) => __awaiter(this, void 0, void 0, function* () {
            if (req.body.contrasena) {
                req.body.contrasena = yield bcrypt.hashSync(req.body.contrasena, 10);
            }
        });
        // checkValidation = async (req: Request, next: NextFunction) => {
        //     const errors = validationResult(req)
        //     console.log(errors.Result);
        //     if (!errors.isEmpty()) {
        //         //throw new HttpException(400, 'Validation faild', errors);
        //         next( new ErrorResponse(`Validacion fallida`, 400, errors.Result))
        //     }
        // }
    }
}
module.exports = new UserController;
