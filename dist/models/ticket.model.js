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
class TicketModel {
    constructor() {
        this.tabla = 'ticket';
        this.find = (params = {}) => __awaiter(this, void 0, void 0, function* () {
            const order = ` ORDER by t.actualizado DESC`;
            const tecnico = ` AND ut.estatus = 'ATENCION'`;
            const sqlAdmin = `SELECT tk.id_ticket, t.titulo, t.descripcion, t.creado, t.actualizado, t.primeraRespuesta, t.cierre, t.estatus, t.prioridad, t.escalado, t.tipo, s.nombre AS subcategoria, c.descripcion AS categoria, GROUP_CONCAT(u.id_usuario, ' : ', tk.estatus, ' : ', u.nombre ORDER BY tk.estatus DESC SEPARATOR ' | ') AS usuarios, suc.descripcion AS sucursal  from ticket_usuario tk
        INNER JOIN usuario u ON u.id_usuario = tk.id_usuario 
        INNER JOIN ticket t ON t.id_ticket = tk.id_ticket 
        INNER JOIN subcategoria s ON t.id_subcategoria = s.id_subcategoria
        INNER JOIN categoria c ON s.id_categoria = c.id_categoria
        INNER JOIN sucursal suc ON t.id_ubicacionCliente = suc.id_sucursal
        WHERE t.estatus <> 4 AND t.estatus <> 5 AND t.estatus <> 6
        GROUP BY tk.id_ticket
        ORDER BY t.actualizado DESC `;
            let sqlTec = `SELECT u.id_usuario, u.nombre as tecnico, t.id_ticket, t.referencia, t.titulo, t.descripcion, t.estatus, t.prioridad, t.actualizado, s.nombre as subcategoria, c.descripcion as categoria 
        FROM usuario u 
        INNER JOIN ticket_usuario ut ON ut.id_usuario = u.id_usuario 
        INNER JOIN ticket t ON ut.id_ticket = t.id_ticket 
        INNER JOIN subcategoria s on t.id_subCategoria = s.id_subCategoria 
        INNER JOIN categoria c on s.id_categoria = c.id_categoria 
        WHERE t.estatus <> 4 AND t.estatus <> 5 AND t.estatus <> 6        
        `;
            if (!Object.keys(params).length) {
                return yield index_model_1.query(sqlAdmin);
            }
            const { columnSet, values } = multipleColumnSet(params);
            sqlTec += ` AND u.${columnSet}`;
            sqlTec += tecnico;
            sqlTec += order;
            return yield index_model_1.query(sqlTec, [...values]);
        });
        this.findByStatus = (params = {}) => __awaiter(this, void 0, void 0, function* () {
            if (params.id_usuario && params.estatus) {
                // Tecnico
                const { estatus, id_usuario } = params;
                let statusTec = `SELECT u.id_usuario, u.nombre as tecnico, t.id_ticket, t.referencia, t.titulo, t.descripcion, t.estatus, t.prioridad, t.actualizado, s.nombre as subcategoria, c.descripcion as categoria 
            FROM usuario u 
            INNER JOIN ticket_usuario ut ON ut.id_usuario = u.id_usuario 
            INNER JOIN ticket t ON ut.id_ticket = t.id_ticket 
            INNER JOIN subcategoria s on t.id_subCategoria = s.id_subCategoria 
            INNER JOIN categoria c on s.id_categoria = c.id_categoria 
            WHERE t.estatus = ${estatus} AND (u.id_usuario = ${id_usuario} AND ut.estatus = 'ATENCION')
            ORDER by t.actualizado DESC
            `;
                return yield index_model_1.query(statusTec);
            }
            if (params.estatus) {
                const { estatus } = params;
                // Admin
                const statusAdmin = `SELECT tk.id_ticket, t.titulo, t.descripcion, t.creado, t.actualizado, t.primeraRespuesta, t.cierre, t.estatus, t.prioridad, t.escalado, t.tipo, s.nombre AS subcategoria, c.descripcion AS categoria, GROUP_CONCAT(u.id_usuario, ' : ', tk.estatus, ' : ', u.nombre ORDER BY tk.estatus DESC SEPARATOR ' | ') AS usuarios, suc.descripcion AS sucursal  from ticket_usuario tk
            INNER JOIN usuario u ON u.id_usuario = tk.id_usuario 
            INNER JOIN ticket t ON t.id_ticket = tk.id_ticket 
            INNER JOIN subcategoria s ON t.id_subcategoria = s.id_subcategoria
            INNER JOIN categoria c ON s.id_categoria = c.id_categoria
            INNER JOIN sucursal suc ON t.id_ubicacionCliente = suc.id_sucursal
            WHERE t.estatus = ${estatus} 
            GROUP BY tk.id_ticket
            ORDER BY t.actualizado DESC`;
                return yield index_model_1.query(statusAdmin);
            }
        });
        this.findOne = (params) => __awaiter(this, void 0, void 0, function* () {
            const { columnSet, values } = multipleColumnSet(params);
            let sql1 = `
        SELECT tk.id_ticket, t.titulo, t.descripcion, t.creado, t.actualizado, t.primeraRespuesta, t.cierre, t.estatus, t.prioridad, t.escalado, t.tipo, s.nombre AS subcategoria, c.descripcion AS categoria, GROUP_CONCAT(u.id_usuario, ' : ', tk.estatus, ' : ', u.nombre ORDER BY tk.estatus DESC SEPARATOR ' | ') AS usuarios, suc.descripcion AS sucursal  from ticket_usuario tk
	    INNER JOIN usuario u ON u.id_usuario = tk.id_usuario 
	    INNER JOIN ticket t ON t.id_ticket = tk.id_ticket 
	    INNER JOIN subcategoria s ON t.id_subcategoria = s.id_subcategoria
	    INNER JOIN categoria c ON s.id_categoria = c.id_categoria
	    INNER JOIN sucursal suc ON t.id_ubicacionCliente = suc.id_sucursal
	    WHERE t.${columnSet}
	    GROUP BY tk.id_ticket
	    ORDER BY t.actualizado DESC`;
            const result = yield index_model_1.query(sql1, [...values]);
            return result[0];
        });
        this.create = (params) => __awaiter(this, void 0, void 0, function* () {
            const { id_subcategoria, titulo, descripcion, cierre, estatus, prioridad, escalado, tipo, referencia, id_ubicacionCliente } = params;
            const sql = `INSERT INTO ${this.tabla} 
        (id_subcategoria, titulo, descripcion, primeraRespuesta, cierre, estatus, prioridad, escalado, tipo, referencia, id_ubicacionCliente) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const result = yield index_model_1.query(sql, [id_subcategoria, titulo, descripcion, '0000-00-00 00:00:00', cierre, estatus, prioridad, escalado, tipo, referencia, id_ubicacionCliente]);
            return result;
        });
        this.createTicketUsuario = (id_ticket, id_usuario, estatus) => __awaiter(this, void 0, void 0, function* () {
            const sql = `INSERT INTO ticket_usuario 
        (id_ticket, id_usuario, estatus) VALUES (?, ?, ?)`;
            yield index_model_1.query(sql, [id_ticket, id_usuario, estatus]);
        });
        this.update = (paramsFull, id) => __awaiter(this, void 0, void 0, function* () {
            const { id_subcategoria, creado, actualizado, primeraRespuesta, cierre, referencia, id_ubicacionCliente } = paramsFull, params = __rest(paramsFull, ["id_subcategoria", "creado", "actualizado", "primeraRespuesta", "cierre", "referencia", "id_ubicacionCliente"]);
            const { columnSet, values } = multipleColumnSet(params);
            const sql = `UPDATE ${this.tabla} SET ${columnSet} WHERE id_ticket = ?`;
            const result = yield index_model_1.query(sql, [...values, id]);
            return result;
        });
        this.changeStatus = (estatus, id) => __awaiter(this, void 0, void 0, function* () {
            const sql = `UPDATE ${this.tabla} SET estatus = ? WHERE id_ticket = ?`;
            const result = yield index_model_1.query(sql, [estatus, id]);
            return result;
        });
        this.dateFirtAnswer = (fecha, id) => __awaiter(this, void 0, void 0, function* () {
            const sql = `UPDATE ${this.tabla} SET primeraRespuesta = ? WHERE id_ticket = ?`;
            const result = yield index_model_1.query(sql, [fecha, id]);
            return result;
        });
        // Cerrar o reabrir ticket y cambiar fecha de cierre.
        this.changeStatusClose = (params, id) => __awaiter(this, void 0, void 0, function* () {
            const { estatus, cierre } = params;
            const sql = `UPDATE ${this.tabla} SET estatus = ?, cierre = ? WHERE id_ticket = ?`;
            const result = yield index_model_1.query(sql, [estatus, cierre, id]);
            return result;
        });
        this.previousOperation = (id, referencia) => __awaiter(this, void 0, void 0, function* () {
            let result;
            let sql = `SELECT COUNT(id_ticket) AS hijos FROM ${this.tabla} t WHERE t.referencia = ?`;
            switch (referencia) {
                case 0:
                    sql = `SELECT referencia FROM ${this.tabla} WHERE id_ticket = ?`;
                    break;
                case 4:
                    sql += ` AND t.estatus <> 4 AND t.estatus <> 5`;
                    break;
                case 5:
                    sql += ` AND t.estatus <> 4 AND t.estatus <> 6`;
                    break;
                case 6:
                    sql += ` AND t.estatus <> 6 AND t.estatus <> 5 AND t.estatus <> 4`;
                    break;
                case 7:
                    sql = `SELECT estatus FROM ${this.tabla} t WHERE t.id_ticket = ?`;
                    break;
                // Obtener primera respuesta...
                case 10:
                    sql = `SELECT primeraRespuesta FROM ${this.tabla} t WHERE t.id_ticket = ?`;
                    break;
                default:
                    sql = '';
                    break;
            }
            result = yield index_model_1.query(sql, [id]);
            return result[0];
        });
    }
}
module.exports = new TicketModel;
