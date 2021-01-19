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
const LocationModel = require('../models/location.model');
class LocationController {
    constructor() {
        this.getAllLocations = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let listaSucursales = yield LocationModel.find({ activo: req.body.activo });
                if (!listaSucursales.length) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'No se encontró sucursales'
                        }
                    });
                }
                res.json({
                    ok: true,
                    listaSucursales
                });
            }
            catch (error) {
                next(`No se pudo procesar el request ${error}`);
            }
        });
        this.getLocationById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const sucursal = yield LocationModel.findOne({ id_sucursal: req.params.id });
                if (!sucursal) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'No se encontró sucursal'
                        }
                    });
                }
                res.json({
                    ok: true,
                    sucursal
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.createLocation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locationExists = yield LocationModel.findOne({ descripcion: req.body.descripcion });
                if (!locationExists) {
                    const result = yield LocationModel.create(req.body);
                    if (!result) {
                        return res.status(500).json({
                            ok: false,
                            error: {
                                message: 'Ocurrió un error en el proceso de insersion'
                            }
                        });
                    }
                    res.status(201).json({
                        ok: true,
                        message: 'Sucursal creado correctamente'
                    });
                }
                else {
                    return res.status(500).json({
                        ok: false,
                        error: {
                            message: 'Sucursal está registrado en la bd'
                        }
                    });
                }
            }
            catch (error) {
                next(`Error al processar el request: ${error}`);
            }
        });
        this.updateLocation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield LocationModel.update(req.body, req.params.id);
                const { affectedRows, info } = result;
                if (!result) {
                    return res.status(500).json({
                        ok: false,
                        error: {
                            message: 'Ocurrió un error en el proceso de actualización'
                        }
                    });
                }
                if (!affectedRows) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'Sucursal no existe',
                            info
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    message: 'Sucursal actualizado correctamente',
                    info
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.enableDisableLocation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield LocationModel.enableDisable(req.body, req.params.id);
                if (!result) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'Ha ocurrido un error'
                        }
                    });
                }
                const { affectedRows, info } = result;
                if (!affectedRows) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'Sucursal no existe',
                            info
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    message: 'Estatus sucursal actualizado correctamente',
                    info
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
    }
}
module.exports = new LocationController;
