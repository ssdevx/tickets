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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var query = require('../mysql/mysql');
var multipleColumnSet = require('../utils/common.utils').multipleColumnSet;
var SucursalModel = /** @class */ (function () {
    function SucursalModel() {
        var _this = this;
        this.tabla = 'ubicacion';
        this.find = function (params) {
            if (params === void 0) { params = {}; }
            return __awaiter(_this, void 0, void 0, function () {
                var sql, _a, columnSet, values;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            sql = "SELECT * FROM " + this.tabla;
                            console.log('Parametros', params);
                            if (!!Object.keys(params).length) return [3 /*break*/, 2];
                            return [4 /*yield*/, query(sql)];
                        case 1: return [2 /*return*/, _b.sent()];
                        case 2:
                            _a = multipleColumnSet(params), columnSet = _a.columnSet, values = _a.values;
                            sql += " WHERE " + columnSet;
                            return [4 /*yield*/, query(sql, __spreadArrays(values))];
                        case 3: return [2 /*return*/, _b.sent()];
                    }
                });
            });
        };
        this.findOne = function (params) { return __awaiter(_this, void 0, void 0, function () {
            var _a, columnSet, values, sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = multipleColumnSet(params), columnSet = _a.columnSet, values = _a.values;
                        sql = "SELECT * FROM " + this.tabla + "\n        WHERE " + columnSet;
                        return [4 /*yield*/, query(sql, __spreadArrays(values))];
                    case 1:
                        result = _b.sent();
                        // return back the first row (user)
                        return [2 /*return*/, result[0]];
                }
            });
        }); };
        this.create = function (_a) {
            var _b = _a.ubicacionDesc, ubicacionDesc = _b === void 0 ? '' : _b, _c = _a.activo, activo = _c === void 0 ? 1 : _c;
            return __awaiter(_this, void 0, void 0, function () {
                var sql, result, filasAfectadas;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            sql = "INSERT INTO " + this.tabla + " \n            (ubicacionDesc, activo) VALUES (?, ?)";
                            return [4 /*yield*/, query(sql, [ubicacionDesc, activo])];
                        case 1:
                            result = _d.sent();
                            filasAfectadas = result ? result.filasAfectadas : 0;
                            console.log(filasAfectadas);
                            return [2 /*return*/, filasAfectadas];
                    }
                });
            });
        };
        this.update = function (params, id) { return __awaiter(_this, void 0, void 0, function () {
            var _a, columnSet, values, sql, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = multipleColumnSet(params), columnSet = _a.columnSet, values = _a.values;
                        sql = "UPDATE " + this.tabla + " SET " + columnSet + " WHERE PK_idUbicacion = ?";
                        return [4 /*yield*/, query(sql, __spreadArrays(values, [id]))];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.delete = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "UPDATE " + this.tabla + " SET activo = 0 WHERE PK_idUbicacion = ?";
                        return [4 /*yield*/, query(sql, [id])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        }); };
    }
    return SucursalModel;
}());
module.exports = new SucursalModel;
