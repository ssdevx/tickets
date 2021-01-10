const CategoriaModel = require('../models/categoria.model');
import { NextFunction, Request, Response} from 'express';
const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/error.utils');


class CategoryController {

    getAllCategories = async (req: Request, res: Response, next: NextFunction) => {

        try {

            let categoryList = await CategoriaModel.find({ activo: req.body.activo});

            if (!categoryList.length) {
                return res.status(404).json({
                    ok: false, 
                    error: {
                        message: 'No se encontraron categorias'
                    }
                })            
            }

            res.status(200).json({
                ok: true,
                data: categoryList
            })
            
        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }
    };


    getCategory = async (req: Request, res: Response, next: NextFunction) => {
        
        try {

            const category = await CategoriaModel.findOne({ id_categoria: req.params.id});

            if (!category) {
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'No se encontró categoria'
                    }
                })
            }

            res.json({
                ok: true,
                data: category
            });
            
        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }

    };

    


    createCategory = async(req: Request, res: Response, next: NextFunction ) => {

        try {
            
            const categoryExists = await CategoriaModel.findOne({descripcion : req.body.descripcion});

            if(!categoryExists){

                const result = await CategoriaModel.create(req.body);

                if(!result){
                    return res.status(400).json({
                        ok: false, 
                        error: {
                            message: 'Error al crear categoria.'
                        }
                    })
                }

                res.status(201).json({
                    ok: true, 
                    message: 'Categoria creado correctamente'
                })

            } else {

                return res.status(400).json({
                    ok: false, 
                    error: {
                        message: 'La categoria ya está registrado en la BD.'
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

module.exports = new CategoryController;
