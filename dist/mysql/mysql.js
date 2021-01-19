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
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql2");
const dotenv = require('dotenv');
dotenv.config();
class Conexion {
    constructor() {
        this.conectado = false;
        this.query = (sql, values) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const callback = (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                };
                this.pool.execute(sql, values, callback);
            }).catch(err => {
                throw err;
            });
        });
        console.log('Clase inicializada');
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE,
            connectionLimit: 5
        });
        //this.cnn.connect();
        this.conectarDB();
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    conectarDB() {
        try {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                        console.error('Database connection was closed');
                    }
                    if (err.code === 'ER_CON_COUNT_ERROR') {
                        console.error('Database has too many connections');
                    }
                    if (err.code === 'ECONNREFUSED') {
                        console.error('Database connecTion was refused');
                    }
                }
                if (connection) {
                    console.log('Conectado a BD');
                    connection.release();
                }
                return;
            });
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
}
module.exports = new Conexion().query;
