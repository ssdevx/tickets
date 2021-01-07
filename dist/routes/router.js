"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mysql_1 = __importDefault(require("../mysql/mysql"));
var router = express_1.Router();
router.get('/usuarios', function (req, res) {
    var query = "\n    SELECT usuario.PK_idUsuario,usuario.nombre,usuario.apellidos, usuario.fechaRegistro, usuario.correo, usuario.telefono,usuario.rol, usuario.activo, ubicacion.ubicacionDesc FROM usuario \n        INNER JOIN ubicacion \n        ON usuario.FK_idUbicacion = ubicacion.PK_idUbicacion \n        ORDER BY usuario.activo DESC\n    ";
    mysql_1.default.ejecutarQuery(query, function (err, usuarios) {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            usuarios: usuarios
        });
    });
});
router.get('/usuarios/:rol', function (req, res) {
    var rol = req.params.rol;
    //const rolEscape = MySQL.instance.cnn.escape(rol)
    var query = "\n        SELECT u.PK_idUsuario, u.nombre, u.apellidos, u.usuario, u.fechaRegistro, u.correo, u.telefono, u.rol \n        FROM usuario u\n        INNER JOIN ubicacion \n        ON u.FK_idUbicacion = ubicacion.PK_idUbicacion\n    ";
    //let condicion: string = '';
    switch (rol) {
        case 'sistemas':
            query += ' WHERE u.activo = 1 AND(u.rol = 1 or u.rol = 2 )';
            break;
        case 'administradores':
            query += ' WHERE u.activo = 1 AND u.rol = 1';
            break;
        case 'usuarios':
            query += ' WHERE u.activo = 1 AND u.rol = 3';
            break;
        case 'tecnicos':
            query += ' WHERE u.activo = 1 AND u.rol = 2';
            break;
        case '':
            query += '';
            break;
        default:
            //query = '';
            break;
    }
    console.log(query);
    mysql_1.default.ejecutarQuery(query, function (err, usuarios) {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            usuarios: usuarios
        });
    });
});
router.get('/usuarios/:id', function (req, res) {
    var id = req.params.id;
    var idEscaped = mysql_1.default.instance.cnn.escape(id);
    var query = "\n        SELECT * FROM usuario where PK_idUsuario = " + idEscaped + "\n    ";
    mysql_1.default.ejecutarQuery(query, function (err, usuario) {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            usuario: usuario[0]
        });
    });
});
exports.default = router;
