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
Object.defineProperty(exports, "__esModule", { value: true });
const index_model_1 = require("./index.model");
const { multipleColumnSet, multipleColumnGet } = require('../utils/common.utils');
class SubcategoryModel {
    constructor() {
        this.tabla = 'subcategoria';
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
            const { columnSet, values } = multipleColumnGet(params);
            const sql = `SELECT * FROM ${this.tabla}
        WHERE ${columnSet}`;
            const result = yield index_model_1.query(sql, [...values]);
            return result[0];
        });
        this.create = (params) => __awaiter(this, void 0, void 0, function* () {
            const { id_categoria, nombre } = params;
            const sql = `INSERT INTO ${this.tabla} 
            (id_categoria, nombre, activo) VALUES (?, ?, ?)`;
            const result = yield index_model_1.query(sql, [id_categoria, nombre, 1]);
            const filasAfectadas = result ? result.affectedRows : 0;
            return filasAfectadas;
        });
        this.update = (params, id) => __awaiter(this, void 0, void 0, function* () {
            const { columnSet, values } = multipleColumnSet(params);
            const sql = `UPDATE ${this.tabla} SET ${columnSet} WHERE id_subcategoria = ?`;
            const result = yield index_model_1.query(sql, [...values, id]);
            return result;
        });
        this.enableDisable = (params, id) => __awaiter(this, void 0, void 0, function* () {
            const { activo } = params;
            const sql = `UPDATE ${this.tabla} SET activo = ? WHERE id_subcategoria = ?`;
            const result = yield index_model_1.query(sql, [activo, id]);
            return result;
        });
    }
}
module.exports = new SubcategoryModel;
