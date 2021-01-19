import { query } from './index.model';

class EventsModel {

    tabla: string = 'evento';

    create = async (params: any) => {

        const sql = `INSERT INTO ${this.tabla} 
            (id_ticket, id_usuario, evento) VALUES (?, ?, ?)`;

        const { id_ticket, id_usuario, evento } = params;
        
        const result = await query(sql, [id_ticket, id_usuario, evento]);

        const filasAfectadas = result ? result.affectedRows : 0;

        return filasAfectadas;

    }

}


module.exports = new EventsModel;