const LocationModel = require('../models/location.model');
import { NextFunction, Request, Response} from 'express';

class LocationController{

    getAllLocations = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let listaSucursales = await LocationModel.find({activo: req.body.activo});

            if (!listaSucursales.length) {
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'No se encontró sucursales'
                    }
                })
            }

            res.json({
                ok: true,
                listaSucursales
            });
            
        } catch (error) {
            next(`No se pudo procesar el request ${error}`)
        }
    }


    getLocationById = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const sucursal = await LocationModel.findOne({ id_sucursal: req.params.id });

            if (!sucursal) {
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'No se encontró sucursal'
                    }
                })
            }

            res.json({
                ok: true,
                sucursal
            });

        } catch (error) {            
            next(`No se puede procesar el request ${error}`);
        }
    };


    createLocation = async (req:Request, res: Response, next: NextFunction) => {
        try {          
            
            const locationExists = await LocationModel.findOne({ descripcion : req.body.descripcion});

            if(!locationExists){

                const result = await LocationModel.create(req.body);

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

            } else {
                return res.status(500).json({
                    ok: false,
                    error: {
                        message: 'Sucursal está registrado en la bd'
                    }
                })
            }

        } catch (error) {
            next(`Error al processar el request: ${error}`)
        }
    }


    updateLocation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await LocationModel.update(req.body, req.params.id);

            const { affectedRows, info } = result;

            if (!result) {
                return res.status(500).json({
                    ok: false,
                    error: {
                        message: 'Ocurrió un error en el proceso de actualización'
                    }
                })
            } 

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


    enableDisableLocation = async(req: Request, res: Response, next: NextFunction) => {
        try {
            
            const result = await LocationModel.enableDisable(req.body, req.params.id);

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
                        message: 'Sucursal no existe',
                        info
                    }
                })
            }

            res.status(200).json({ 
                ok: true,
                message: 'Estatus sucursal actualizado correctamente', 
                info 
            });

        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }
    }
}

module.exports = new LocationController;