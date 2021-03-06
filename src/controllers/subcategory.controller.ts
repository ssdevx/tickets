import { NextFunction, Request, Response} from 'express';
const SubcategoryModel = require('../models/subcategory.model');


class SubcategoryController {

    getAllSubcategories = async (req: Request, res: Response, next: NextFunction) => {

        try {

            let subcategoryList = await SubcategoryModel.find({ activo: req.body.activo});

            if (!subcategoryList.length) {
                return res.status(404).json({
                    ok: false, 
                    error: {
                        message: 'No se encontraron subcategorias'
                    }
                })            
            }

            res.status(200).json({
                ok: true,
                data: subcategoryList
            })
            
        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }
    };


    getSubcategory = async (req: Request, res: Response, next: NextFunction) => {
        
        try {

            const subcategory = await SubcategoryModel.findOne({ id_subcategoria: req.params.id});

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

    
    createSubcategory = async(req: Request, res: Response, next: NextFunction ) => {

        try {
            
            const subcategoryExists = await this.checkDuplicates(req);

            if(subcategoryExists){

                const result = await SubcategoryModel.create(req.body);

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


    updateSubcategory = async (req:Request, res: Response, next: NextFunction) => {
        try {
            
            const result = await SubcategoryModel.update(req.body, req.params.id);

            if(!result){
                return res.status(404).json({
                    ok: false,
                    error:{
                        message: 'Ha ocurrido un error'
                    }
                })
            }

            const { affectedRows, info } = result;

            if (!affectedRows){
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Subcategoria no existe',
                        info
                    }
                })
            }

            res.status(200).json({ 
                ok: true,
                message: 'Subcategoria actualizado correctamente', 
                info 
            });

        } catch (error) {
           
            next(`No se puede procesar el request ${error}`)
        }
    }


    enableDisableSubcategory = async(req: Request, res: Response, next: NextFunction) => {

        try {
            
            const result = await SubcategoryModel.enableDisable(req.body, req.params.id);

            if(!result){
                return res.status(404).json({
                    ok: false,
                    error:{
                        message: 'Ha ocurrido un error'
                    }
                })
            }

            const { affectedRows, info } = result;

            if (!affectedRows){
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Subcategoria no existe',
                        info
                    }
                })
            }

            res.status(200).json({ 
                ok: true,
                message: 'Estatus subcategoria actualizado correctamente', 
                info 
            });

        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }
    }

    checkDuplicates = async(req: Request) => {
        
        const subcategory = await SubcategoryModel.findOne({nombre : req.body.nombre, id_categoria : req.body.id_categoria});

        if (!subcategory){

            return true;

        } else {

            return false;
        }
        
    }
}

module.exports = new SubcategoryController;