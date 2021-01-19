
import { param } from 'express-validator';
import { query } from './index.model';
import express from 'express';

const { multipleColumnSet } = require('../utils/common.utils');

class TicketModel {

    tabla: String = 'ticket';

    find = async (params = { }) => {
    
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
        `

        if (!Object.keys(params).length) {

            return await query(sqlAdmin);            
        }

        const { columnSet, values } = multipleColumnSet(params)
        
        sqlTec += ` AND u.${columnSet}`;
        sqlTec += tecnico;
        sqlTec += order;

        return await query(sqlTec, [...values]);

    }


    findByStatus = async (params: any = { }) => {
    
        if(params.id_usuario && params.estatus){

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
            `
            return await query(statusTec);

        }

        if(params.estatus){

            const { estatus } = params
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

            return await query(statusAdmin); 
        }
    }


    findOne = async (params: any) => {

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
       
        const result = await query(sql1, [...values]);

        return result[0];

    }

    create = async ( params : any) => {

        const { id_subcategoria, titulo, descripcion, cierre, estatus, prioridad, escalado, tipo, referencia, id_ubicacionCliente } = params;

        const sql = `INSERT INTO ${this.tabla} 
        (id_subcategoria, titulo, descripcion, primeraRespuesta, cierre, estatus, prioridad, escalado, tipo, referencia, id_ubicacionCliente) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const result = await query(sql, [id_subcategoria, titulo, descripcion, '0000-00-00 00:00:00', cierre, estatus, prioridad, escalado, tipo, referencia, id_ubicacionCliente]);

        return result;

    }


    createTicketUsuario = async (id_ticket: number, id_usuario: number, estatus: string) => {

        const sql = `INSERT INTO ticket_usuario 
        (id_ticket, id_usuario, estatus) VALUES (?, ?, ?)`;

        await query(sql, [id_ticket, id_usuario, estatus]);

    }


    update = async (paramsFull: any, id: number) => {

        const { id_subcategoria, creado, actualizado, primeraRespuesta, cierre, referencia, id_ubicacionCliente, ...params} = paramsFull

        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tabla} SET ${columnSet} WHERE id_ticket = ?`;

        const result = await query(sql, [...values, id]);

        return result;

    }


    changeStatus = async (estatus: number, id : number) => {

        const sql = `UPDATE ${this.tabla} SET estatus = ? WHERE id_ticket = ?`;

        const result = await query(sql, [estatus, id]);

        return result;

    }


    dateFirtAnswer = async (fecha: string, id : number) => {

        const sql = `UPDATE ${this.tabla} SET primeraRespuesta = ? WHERE id_ticket = ?`;

        const result = await query(sql, [fecha, id]);

        return result;

    }

    


    // Cerrar o reabrir ticket y cambiar fecha de cierre.
    changeStatusClose = async (params: any, id: number) => {
        const { estatus, cierre } = params;

        const sql = `UPDATE ${this.tabla} SET estatus = ?, cierre = ? WHERE id_ticket = ?`;

        const result = await query(sql, [estatus, cierre, id]);

        return result;
    }


    previousOperation = async ( id: number, referencia: number ) => {

        let result: any;
        let sql: string = `SELECT COUNT(id_ticket) AS hijos FROM ${this.tabla} t WHERE t.referencia = ?`;

        switch (referencia) {
            case 0: 
                sql = `SELECT referencia FROM ${this.tabla} WHERE id_ticket = ?`;
                break

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
                sql = `SELECT primeraRespuesta FROM ${this.tabla} t WHERE t.id_ticket = ?`
                break;

            default:
                sql = '';
                break;
        }

        result = await query(sql, [id]);

        return result[0];
    }


    
}

module.exports = new TicketModel;