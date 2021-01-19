import mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

class Conexion {

    private static _instance: Conexion;

    pool: mysql.Pool;

    conectado: boolean = false;

    constructor(){
        console.log('Clase inicializada');

        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE, 
            connectionLimit: 5
        })

        //this.cnn.connect();
        this.conectarDB();
    }


    public static get instance(){
        return this._instance || (this._instance = new this());
    }
    

    private conectarDB(){
       try {
            
            this.pool.getConnection((err, connection) => {

                if(err){
                    if (err.code === 'PROTOCOL_CONNECTION_LOST'){
                        console.error('Database connection was closed');
                    }

                    if (err.code === 'ER_CON_COUNT_ERROR'){
                        console.error('Database has too many connections');
                    }

                    if (err.code === 'ECONNREFUSED'){
                        console.error('Database connecTion was refused');
                    }
                }

                if ( connection ) {
                    console.log('Conectado a BD');
                    connection.release();
                }

            return;
        })

       } catch (error) {
           console.log(error);
           return
       }
    }


    query = async (sql: string, values: Object[]) => {

        return new Promise((resolve, reject) => {
            const callback = (error: any, result: any) => {

                if(error) {

                    return reject(error);                    
                }
                resolve(result);
            }

            this.pool.execute(sql, values, callback);

        }).catch( err => {

            throw err;
        })
    }

}

module.exports = new Conexion().query;