"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path = require("path");
var Server = /** @class */ (function () {
    function Server(puerto) {
        this.port = puerto;
        this.app = express_1.default();
    }
    Server.init = function (puerto) {
        return new Server(puerto);
    };
    Server.prototype.publicFolder = function () {
        var publicPath = path.resolve(__dirname, 'public');
        this.app.use(express_1.default.static(publicPath));
    };
    Server.prototype.start = function (callback) {
        this.app.listen(this.port, callback());
        this.publicFolder();
    };
    return Server;
}());
exports.default = Server;
