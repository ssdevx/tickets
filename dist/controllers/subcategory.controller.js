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
const SubcategoryModel = require('../models/subcategory.model');
class SubcategoryController {
    constructor() {
        this.getAllSubcategories = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let subcategoryList = yield SubcategoryModel.find({ activo: req.body.activo });
                if (!subcategoryList.length) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'No se encontraron subcategorias'
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    data: subcategoryList
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.getSubcategory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const subcategory = yield SubcategoryModel.findOne({ id_subcategoria: req.params.id });
                if (!subcategory) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'No se encontró sub categoria'
                        }
                    });
                }
                res.json({
                    ok: true,
                    data: subcategory
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.createSubcategory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const subcategoryExists = yield this.checkDuplicates(req);
                if (subcategoryExists) {
                    const result = yield SubcategoryModel.create(req.body);
                    if (!result) {
                        return res.status(400).json({
                            ok: false,
                            error: {
                                message: 'Error al crear subcategoria.'
                            }
                        });
                    }
                    res.status(201).json({
                        ok: true,
                        message: 'SubCategoria creado correctamente'
                    });
                }
                else {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: 'La subcategoria ya está registrado en la BD.'
                        }
                    });
                }
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.updateSubcategory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield SubcategoryModel.update(req.body, req.params.id);
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
                            message: 'Subcategoria no existe',
                            info
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    message: 'Subcategoria actualizado correctamente',
                    info
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.enableDisableSubcategory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield SubcategoryModel.enableDisable(req.body, req.params.id);
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
                            message: 'Subcategoria no existe',
                            info
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    message: 'Estatus subcategoria actualizado correctamente',
                    info
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.checkDuplicates = (req) => __awaiter(this, void 0, void 0, function* () {
            const subcategory = yield SubcategoryModel.findOne({ nombre: req.body.nombre, id_categoria: req.body.id_categoria });
            if (!subcategory) {
                return true;
            }
            else {
                return false;
            }
        });
    }
}
module.exports = new SubcategoryController;
