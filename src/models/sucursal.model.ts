
const query = require('../mysql/mysql');
const { multipleColumnSet } = require('../utils/common.utils');

class SucursalModel {

    tabla: String = 'ubicacion';

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

        // return back the first row (user)
        return result[0];

    }

    create = async ({ ubicacionDesc = '', activo = 1 }) => {

        const sql = `INSERT INTO ${this.tabla} 
            (ubicacionDesc, activo) VALUES (?, ?)`;

        const result = await query(sql, [ubicacionDesc, activo]);

        const filasAfectadas: number = result ? result.filasAfectadas : 0;


        console.log(filasAfectadas)

        return filasAfectadas;

    }


    update = async (params: any, id: number) => {

        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tabla} SET ${columnSet} WHERE PK_idUbicacion = ?`;

        const result = await query(sql, [...values, id]);

        return result;

    }


    delete = async (id : number) => {

        const sql = `UPDATE ${this.tabla} SET activo = 0 WHERE PK_idUbicacion = ?`;

        const result = await query(sql, [id]);

        return result;

    }

}



module.exports = new SucursalModel;