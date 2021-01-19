
import { query } from './index.model';
const { multipleColumnSet } = require('../utils/common.utils');

class UserModel {

    tabla = 'usuario'

    find = async (params = { }) => {
        let sql = `SELECT * FROM ${this.tabla}`;

        if (!Object.keys(params).length) {
            return await query(sql);            
        }

        const { columnSet, values } = multipleColumnSet(params)
        
        sql += ` WHERE ${columnSet}`;
        return await query(sql, [...values]);
    }

    
    findOne = async (params: any) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tabla}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);
        
        return result[0];
    }
    

    create = async (params : any) => {

        const sql = `INSERT INTO ${this.tabla} 
            (id_sucursal, nombre, apellidos, correo, telefono, ext, contrasena, avatar, rol, activo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const { id_sucursal, nombre, apellidos, correo, telefono, ext, contrasena, avatar, rol} = params;
        
        const result = await query(sql, [id_sucursal, nombre, apellidos, correo, telefono, ext, contrasena, avatar, rol, 1 ]);

        const filasAfectadas = result ? result.affectedRows : 0;

        return filasAfectadas

    }


    update = async (paramsFull: any, id: number) => {

        // Not update contrasena, activo y fechaRegistro...
        const { contrasena, activo, fechaRegistro, ...params} = paramsFull

        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tabla} SET ${columnSet} WHERE id_usuario = ?`;

        const result = await query(sql, [...values, id]);

        return result;
    }


    enableDisable = async (params: any, id : number) => {

        const { activo } = params;

        const sql = `UPDATE ${this.tabla} SET activo = ? WHERE id_usuario = ?`;

        const result = await query(sql, [activo, id]);

        return result;

    }


    changePassword = async (params: any, id : number) => {

        const { contrasena } = params;

        const sql = `UPDATE ${this.tabla} SET contrasena = ? WHERE id_usuario = ?`;

        const result = await query(sql, [contrasena, id]);

        return result;

    }

}


module.exports = new UserModel;