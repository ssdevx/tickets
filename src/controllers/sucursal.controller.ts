const SucursalModel = require('../models/sucursal.model');
import { NextFunction, Request, Response} from 'express';

class SucursalController{

    getAllSucursales = async (req: Request, res: Response, next: NextFunction) => {

        let listaSucursales = await SucursalModel.find({activo: req.body.activo});



        if (!listaSucursales.length) {
            //throw new HttpException(404, 'Users not found');
            res.status(404).json({
                ok: false,
                error: {
                    message: 'Sucursales not found'
                }
            })
        }


        res.json({
            listaSucursales
        });
    }

    getSucursalById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const sucursal = await SucursalModel.findOne({ PK_idUbicacion: req.params.id });

        if (!sucursal) {
            res.status(404).json({
                ok: false,
                error: {
                    message: 'Sucursal not found'
                }
            })
        }

        res.json({
            sucursal
        });

        } catch (error) {
            
            next('No se puede processar el request');

        }

    };



    createSucursal = async (req:Request, res: Response, next: NextFunction) => {

        try {
            
            const result = await SucursalModel.create(req.body);

            console.log('Result: ', result); 
            console.log(!result); 

            if(!result){

                return res.status(500).json({
                    ok: false,
                    error: {
                        message: 'Ocurrió un error en el proceso de insersion'
                    }
                })
            }

            res.status(201).json({

                ok: true,
                message: 'Sucursal creado correctamente'

            });


        } catch (error) {
            next(`Error al processar el request: ${error}`)
        }

    }


    updateSucursal = async (req: Request, res: Response, next: NextFunction) => {
        
        try {
            
            const result = await SucursalModel.update(req.body, req.params.id);

        if (!result) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'Ocurrió un error en el proceso de actualización'
                }
            })
        }

        const { affectedRows, info } = result;

        if (!affectedRows){
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'Sucursal no existe',
                    info
                }
            })
        }

        res.status(200).json({ 
            ok: true,
            message: 'Sucursal actualizado correctamente', 
            info 
        });

        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }
        
    };


    deleteSucursal = async (req: Request, res: Response, next: NextFunction) => {
        
        try {
            


            const result = await SucursalModel.delete(  req.params.id );

        if (!result) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'Ocurrió un error en el proceso de eliminacion'
                }
            })
        }

        const { affectedRows, info } = result;

        if (!affectedRows){
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'Sucursal no existe',
                    info
                }
            })
        }

        res.status(200).json({ 
            ok: true,
            message: 'Sucursal eliminado correctamente', 
            info 
        });

        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }
        
    };



    // deleteUser = async (req, res, next) => {
    //     const result = await UserModel.delete(req.params.id);
    //     if (!result) {
    //         throw new HttpException(404, 'User not found');
    //     }
    //     res.send('User has been deleted');
    // };

}

module.exports = new SucursalController;