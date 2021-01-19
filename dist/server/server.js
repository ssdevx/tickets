"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path = require("path");
class Server {
    constructor(puerto) {
        this.port = puerto;
        this.app = express_1.default();
    }
    static init(puerto) {
        return new Server(puerto);
    }
    publicFolder() {
        const publicPath = path.resolve(__dirname, 'public');
        this.app.use(express_1.default.static(publicPath));
    }
    start(callback) {
        this.app.listen(this.port, callback());
        this.publicFolder();
    }
}
exports.default = Server;
