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
const index_model_1 = require("./index.model");
const { multipleColumnSet } = require('../utils/common.utils');
class UserModel {
    constructor() {
        this.tabla = 'usuario';
        this.find = (params = {}) => __awaiter(this, void 0, void 0, function* () {
            let sql = `SELECT * FROM ${this.tabla}`;
            if (!Object.keys(params).length) {
                return yield index_model_1.query(sql);
            }
            const { columnSet, values } = multipleColumnSet(params);
            sql += ` WHERE ${columnSet}`;
            return yield index_model_1.query(sql, [...values]);
        });
        this.findOne = (params) => __awaiter(this, void 0, void 0, function* () {
            const { columnSet, values } = multipleColumnSet(params);
            const sql = `SELECT * FROM ${this.tabla}
        WHERE ${columnSet}`;
            const result = yield index_model_1.query(sql, [...values]);
            return result[0];
        });
        this.create = (params) => __awaiter(this, void 0, void 0, function* () {
            const sql = `INSERT INTO ${this.tabla} 
            (id_sucursal, nombre, apellidos, correo, telefono, ext, contrasena, avatar, rol, activo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const { id_sucursal, nombre, apellidos, correo, telefono, ext, contrasena, avatar, rol } = params;
            const result = yield index_model_1.query(sql, [id_sucursal, nombre, apellidos, correo, telefono, ext, contrasena, avatar, rol, 1]);
            const filasAfectadas = result ? result.affectedRows : 0;
            return filasAfectadas;
        });
        this.update = (paramsFull, id) => __awaiter(this, void 0, void 0, function* () {
            // Not update contrasena, activo y fechaRegistro...
            const { contrasena, activo, fechaRegistro } = paramsFull, params = __rest(paramsFull, ["contrasena", "activo", "fechaRegistro"]);
            const { columnSet, values } = multipleColumnSet(params);
            const sql = `UPDATE ${this.tabla} SET ${columnSet} WHERE id_usuario = ?`;
            const result = yield index_model_1.query(sql, [...values, id]);
            return result;
        });
        this.enableDisable = (params, id) => __awaiter(this, void 0, void 0, function* () {
            const { activo } = params;
            const sql = `UPDATE ${this.tabla} SET activo = ? WHERE id_usuario = ?`;
            const result = yield index_model_1.query(sql, [activo, id]);
            return result;
        });
        this.changePassword = (params, id) => __awaiter(this, void 0, void 0, function* () {
            const { contrasena } = params;
            const sql = `UPDATE ${this.tabla} SET contrasena = ? WHERE id_usuario = ?`;
            const result = yield index_model_1.query(sql, [contrasena, id]);
            return result;
        });
    }
}
module.exports = new UserModel;
