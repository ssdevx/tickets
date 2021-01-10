
import { query } from './index.model';

const { multipleColumnSet } = require('../utils/common.utils');

class CategoriaModel {

    tabla: String = 'categoria';

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

    create = async ({ descripcion = '', activo = 1 }) => {

        const sql = `INSERT INTO ${this.tabla} 
            (descripcion, activo) VALUES (?, ?)`;

        const result = await query(sql, [descripcion, activo]);

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


module.exports = new CategoriaModel;