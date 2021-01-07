"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __importDefault(require("./server/server"));
var index_route_1 = __importDefault(require("./routes/index.route"));
var express_1 = __importDefault(require("express"));
var server = server_1.default.init(3000);
server.app.use(express_1.default.json());
server.app.use(index_route_1.default);
// MySQL instance
//MySQL.instance;
server.start(function () {
    console.log('Servidor corriendo en el puerto 3000');
});
