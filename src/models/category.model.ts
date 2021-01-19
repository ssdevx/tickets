
import { query } from './index.model';
const { multipleColumnSet } = require('../utils/common.utils');

class CategoryModel {

    tabla: String = 'categoria';

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


    create = async (params: any) => {

        const sql = `INSERT INTO ${this.tabla} 
            (descripcion, activo) VALUES (?, ?)`;

        const { descripcion} = params;
        
        const result = await query(sql, [descripcion, 1]);

        const filasAfectadas = result ? result.affectedRows : 0;

        return filasAfectadas;

    }


    update = async (params: any, id: number) => {

        const { descripcion } = params;

        const sql = `UPDATE ${this.tabla} SET descripcion = ? WHERE id_categoria = ?`;

        const result = await query(sql, [descripcion, id]);

        return result;

    }


    enableDisable = async (params: any, id : number) => {

        const { activo } = params;

        const sql = `UPDATE ${this.tabla} SET activo = ? WHERE id_categoria = ?`;

        const result = await query(sql, [activo, id]);

        return result;

    }

}


module.exports = new CategoryModel;