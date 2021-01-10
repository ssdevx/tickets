const SubCategoryModel = require('../models/subcategory.model');
import { NextFunction, Request, Response} from 'express';
const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/error.utils');


class SubCategoryController {

    getAllSubCategories = async (req: Request, res: Response, next: NextFunction) => {

        try {

            let subCategoryList = await SubCategoryModel.find({ activo: req.body.activo});

            if (!subCategoryList.length) {
                return res.status(404).json({
                    ok: false, 
                    error: {
                        message: 'No se encontraron subcategorias'
                    }
                })            
            }

            res.status(200).json({
                ok: true,
                data: subCategoryList
            })
            
        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }
    };


    getSubCategory = async (req: Request, res: Response, next: NextFunction) => {
        
        try {

            const subcategory = await SubCategoryModel.findOne({ id_categoria: req.params.id});

            if (!subcategory) {
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'No se encontró sub categoria'
                    }
                })
            }

            res.json({
                ok: true,
                data: subcategory
            });
            
        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }

    };

    
    createSubCategory = async(req: Request, res: Response, next: NextFunction ) => {

        try {
            

            const subcategoryExists = await SubCategoryModel.findOne({nombre : req.body.nombre});

            if(!subcategoryExists){

                const result = await SubCategoryModel.create(req.body);

                if(!result){
                    return res.status(400).json({
                        ok: false, 
                        error: {
                            message: 'Error al crear subcategoria.'
                        }
                    })
                }

                res.status(201).json({
                    ok: true, 
                    message: 'SubCategoria creado correctamente'
                })

            } else {

                return res.status(400).json({
                    ok: false, 
                    error: {
                        message: 'La subcategoria ya está registrado en la BD.'
                    }
                })
            }

        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }

    }



    checkValidation = async (req: Request, next: NextFunction) => {

        const errors = validationResult(req)

        console.log(errors.Result);

        if (!errors.isEmpty()) {
            //throw new HttpException(400, 'Validation faild', errors);
            next( new ErrorResponse(`Validacion fallida`, 400, errors.Result))
            
        }
    }

}

module.exports = new SubCategoryController;
