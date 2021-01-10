
import { query } from './index.model';

const { multipleColumnSet } = require('../utils/common.utils');

class SubCategoryModel {

    tabla: String = 'subcategoria';

    find = async (params = { }) => {
        let sql = `SELECT * FROM ${this.tabla}`;

        console.log('Parametros', params);

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

    create = async ({ id_categoria = 0, nombre = '', activo = 1 }) => {

        const sql = `INSERT INTO ${this.tabla} 
            (id_categoria, nombre, activo) VALUES (?, ?, ?)`;

            console.log(id_categoria);

        const result = await query(sql, [id_categoria, nombre, activo]);

        const filasAfectadas = result ? result.affectedRows : 0;

        return filasAfectadas;

    }


    update = async (params: any, id: number) => {

        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tabla} SET ${columnSet} WHERE id_sucursal = ?`;

        const result = await query(sql, [...values, id]);

        return result;

    }


    delete = async (id : number) => {

        const sql = `UPDATE ${this.tabla} SET activo = 0 WHERE id_sucursal = ?`;

        const result = await query(sql, [id]);

        return result;

    }

}


module.exports = new SubCategoryModel;