"use strict";
var _a = require('express-validator'), body = _a.body, check = _a.check;
exports.createuserSchema = [];
exports.validateLogin = [
    check('correo')
        .exists()
        .withMessage('El correo es requerido')
        .isEmail()
        .withMessage('Debe proporcionar un correo válido')
        .normalizeEmail(),
    check('contrasena')
        .exists()
        .withMessage('Contraseña es requerido')
        .notEmpty()
        .withMessage('Debe completar la contraseña')
];
