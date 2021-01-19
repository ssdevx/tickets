"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server/server"));
const index_route_1 = __importDefault(require("./routes/index.route"));
//import cors from 'cors';
const cors = require('cors');
const express_1 = __importDefault(require("express"));
const server = server_1.default.init(3000);
server.app.use(express_1.default.json());
server.app.use(cors());
server.app.options("*", cors());
server.app.use(index_route_1.default);
// MySQL instance
//MySQL.instance;
server.start(() => {
    console.log('Servidor corriendo en el puerto 3000');
});
