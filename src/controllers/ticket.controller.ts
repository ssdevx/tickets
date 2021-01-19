const TicketModel = require('../models/ticket.model');
import { NextFunction, Request, Response} from 'express';
const moment = require('moment');


class TicketController {

    getAllTicketsTec = async (req: Request, res: Response, next: NextFunction) => {

        try {

            let ticketList = await TicketModel.find({id_usuario: req.body.id});
            
            if (!ticketList.length) {
                return res.status(404).json({
                    ok: false, 
                    error: {
                        message: 'No se encontraron tickets'
                    }
                })            
            }

            res.status(200).json({
                ok: true,
                data: ticketList
            })
            
        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }
    };


    getAllTicketsAdmin = async (req: Request, res: Response, next: NextFunction) => {

        try {

            let ticketList = await TicketModel.find();
            
            if (!ticketList.length) {
                return res.status(404).json({
                    ok: false, 
                    error: {
                        message: 'No se encontraron tickets'
                    }
                })            
            }

            res.status(200).json({
                ok: true,
                data: ticketList
            })
            
        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }
    };


    getTicketById = async (req: Request, res: Response, next: NextFunction) => {
        
        try {

            const ticket = await TicketModel.findOne({ id_ticket: req.params.id});

            if (!ticket) {
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'No se encontró ticket'
                    }
                })
            }

            res.json({
                ok: true,
                data: ticket
            });
            
        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }

    };


    getTicketByStatusAdmin = async (req: Request, res: Response, next: NextFunction) => {
        
        try {

            if(Object.keys(req.body).length === 0){
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Argumentos no válidos'
                    }
                })
            }

            const ticketList = await TicketModel.findByStatus(req.body);

            if (!ticketList) {
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'No se encontró ticket'
                    }
                })
            }

            res.json({
                ok: true,
                data: ticketList
            });
            
        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }

    };


    getTicketByStatusTec = async (req: Request, res: Response, next: NextFunction) => {
        
        try {

            if(Object.keys(req.body).length === 0){
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Argumentos no válidos'
                    }
                })
            }

            const ticketList = await TicketModel.findByStatus(req.body);

            if (!ticketList) {
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'No se encontró tickets'
                    }
                })
            }

            res.json({
                ok: true,
                data: ticketList
            });
            
        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }

    };

    
    createTicket = async(req: Request, res: Response, next: NextFunction ) => {

        try {

            // Si se registra un ticket cerrado...
            ( req.body.estatus === 4) ? req.body.cierre = moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm:ss'): req.body.cierre = '0000-00-00 00:00:00';

            const result = await TicketModel.create(req.body);

            const alta = await TicketModel.createTicketUsuario(result.insertId, req.body.alta || 0, 'ALTA');
            const atencion = await TicketModel.createTicketUsuario(result.insertId, req.body.atencion || 0, 'ATENCION');
            const cliente = await TicketModel.createTicketUsuario(result.insertId, req.body.cliente || 0, 'CLIENTE');

            Promise.all([result, alta, atencion, cliente]).then(() => {

                res.status(201).json({
                    ok: true, 
                    message: 'Ticket creado correctamente'
                })
            }).catch(err => {
                
                return res.status(400).json({
                    ok: false, 
                    error: {
                        message: `Error al crear ticket ${err}`
                    }
                })
            })

        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }
    }


    updateTicket = async(req: Request, res: Response, next: NextFunction) => {
        try {
            
            const result = await TicketModel.update(req.body, req.params.id);

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
                        message: 'Ticket no existe',
                        info
                    }
                })
            }

            res.status(200).json({ 
                ok: true,
                message: 'Ticket actualizado correctamente', 
                info 
            });

        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }
    }


    changeStatusTicket = async(req: Request, res: Response, next: NextFunction) => {
        try {

            switch (req.body.estatus) {
                //Cerrar -> si sus hijos estan cerrados o cancelados
                case 4:

                    const childrenTicket = await TicketModel.previousOperation(req.params.id, 4);

                    if(childrenTicket.hijos === 0){

                        // Cerrar aquí
                        //req.body.cierre = moment().format('YYYY-MM-DD HH:mm:ss');
                        await this.changeStatus(req, res);

                    }else{
                        res.json({
                            ok: false,
                            error: {
                                message: 'Error al cerrar el ticket, verificar que no tenga hijos abiertos'
                            }
                        })
                    }

                    break;
                
                // Cancelar -> Si sus hijos están cerrados o resueltos
                case 5:

                    const childrenTicketCancel = await TicketModel.previousOperation(req.params.id, 5);

                    if( childrenTicketCancel.hijos === 0){

                        await this.changeStatus(req, res);

                    } else{

                        res.json({
                            ok: false,
                            error: {
                                message: 'Error al cambiar status de este ticket, verificar que todos los tickets hijos estén cancelados.'
                            }
                        });
                    }
                    break;

                // Resolver -> si sus hijos estan en resueltos, cerrados o cancelados
                case 6:

                    const childrenTicketResolve = await TicketModel.previousOperation(req.params.id, 6);

                    if ( childrenTicketResolve.hijos === 0 ){
                        //const changeStatus = await TicketModel.changeStatus(req.body.estatus, req.params.id);
                        await this.changeStatus(req, res)

                    } else {

                        res.json({
                            ok: false,
                            error: {
                                message: 'Error al cambiar status de este ticket, verificar que todos los tickets hijos estén resueltos.'
                            }
                        })

                    }

                    break;

                // Reabrir Ticket Un Ticket hijo se puede reabrir siempre y cuando el ticket padre tambien esté REABIERTO ó ABIERTO, ASIGNADO y PENDIENTE.
                case 7:
                    const ref = await TicketModel.previousOperation(req.params.id, 0);

                    if ( ref.referencia === 0 ){

                        await this.changeStatus(req, res);
        
                    } else {
        
                        const statusTicket = await TicketModel.previousOperation(req.params.id, 7);

                        if (statusTicket.estatus !== 4){

                            await this.changeStatus(req, res);

                        }else {
                            res.json({
                                ok: false,
                                error: {
                                    message: 'Error al reabrir el ticket, verifique que el ticket padre esté abierto'
                                }
                            })
                        }
                    } 

                    break;
            
                default:

                    res.json({
                        ok: false,
                        error: {
                            message: 'Error al realizar la operacion'
                        }
                    })
                    
                    break;
            }
    
        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }
    }


    changeStatus = async( req: Request, res: Response) => {

        let result : any;
        
        if (req.body.estatus === 4 || req.body.estatus === 7 ){
            
            ( req.body.estatus === 4) ? req.body.cierre = moment().format('YYYY-MM-DD HH:mm:ss'): req.body.cierre = '0000-00-00 00:00:00';
            
            result = await TicketModel.changeStatusClose(req.body, req.params.id)
            
        } else {
            
            result = await TicketModel.changeStatus(req.body.estatus, req.params.id)

        }

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
                    message: 'Ticket no existe',
                    info
                }
            })
        }

        res.status(200).json({ 
            ok: true,
            message: 'Estatus actualizado correctamente', 
            info 
        });
    }
}

module.exports = new TicketController;