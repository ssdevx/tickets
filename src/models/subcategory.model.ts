
import { query } from './index.model';

const { multipleColumnSet, multipleColumnGet } = require('../utils/common.utils');

class SubcategoryModel {

    tabla: String = 'subcategoria';

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

        const { columnSet, values } = multipleColumnGet(params)

        const sql = `SELECT * FROM ${this.tabla}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        return result[0];

    }


    create = async (params: any) => {

        const { id_categoria, nombre} = params;

        const sql = `INSERT INTO ${this.tabla} 
            (id_categoria, nombre, activo) VALUES (?, ?, ?)`;

        const result = await query(sql, [id_categoria, nombre, 1]);

        const filasAfectadas = result ? result.affectedRows : 0;

        return filasAfectadas;

    }


    update = async (params: any, id: number) => {

        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tabla} SET ${columnSet} WHERE id_subcategoria = ?`;

        const result = await query(sql, [...values, id]);

        return result;

    }


    enableDisable = async (params: any, id : number) => {

        const { activo } = params;

        const sql = `UPDATE ${this.tabla} SET activo = ? WHERE id_subcategoria = ?`;

        const result = await query(sql, [activo, id]);

        return result;

    }


    

}


module.exports = new SubcategoryModel;