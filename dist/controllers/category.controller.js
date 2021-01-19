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
const CategoryModel = require('../models/category.model');
class CategoryController {
    constructor() {
        this.getAllCategories = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let categoryList = yield CategoryModel.find({ activo: req.body.activo });
                if (!categoryList.length) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'No se encontraron categorias'
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    data: categoryList
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.getCategory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield CategoryModel.findOne({ id_categoria: req.params.id });
                if (!category) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'No se encontró categoria'
                        }
                    });
                }
                res.json({
                    ok: true,
                    data: category
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.createCategory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryExists = yield CategoryModel.findOne({ descripcion: req.body.descripcion });
                if (!categoryExists) {
                    const result = yield CategoryModel.create(req.body);
                    if (!result) {
                        return res.status(400).json({
                            ok: false,
                            error: {
                                message: 'Error al crear categoria.'
                            }
                        });
                    }
                    res.status(201).json({
                        ok: true,
                        message: 'Categoria creado correctamente'
                    });
                }
                else {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: 'La categoria ya está registrado en la BD.'
                        }
                    });
                }
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.updateCategory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield CategoryModel.update(req.body, req.params.id);
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
                            message: 'Categoria no existe',
                            info
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    message: 'Categoria actualizado correctamente',
                    info
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.enableDisableCategory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield CategoryModel.enableDisable(req.body, req.params.id);
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
                            message: 'Categoria no existe',
                            info
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    message: 'Estatus categoria actualizado correctamente',
                    info
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        // checkValidation = async (req: Request, next: NextFunction) => {
        //     const errors = validationResult(req)
        //     console.log(errors.Result);
        //     if (!errors.isEmpty()) {
        //         //throw new HttpException(400, 'Validation faild', errors);
        //         next( new ErrorResponse(400, `Validacion fallida`, errors.Result))            
        //     }
        // }
    }
}
module.exports = new CategoryController;
