import { NextFunction, Request, Response} from 'express';
const EventsModel = require('../models/events.model');
const TicketModel = require('../models/ticket.model')
const moment = require('moment');

class EventsController {

    createEvent = async(req: Request, res: Response, next: NextFunction ) => {

        try {
            
            const firtAnswer = await TicketModel.previousOperation(req.body.id_ticket, 10);
            
            if (firtAnswer.primeraRespuesta === '0000-00-00 00:00:00'){

                const fecha = moment().format('YYYY-MM-DD HH:mm:ss');

                await TicketModel.dateFirtAnswer(fecha, req.body.id_ticket)

            }

            const result = await EventsModel.create(req.body)

            if(!result){
                return res.status(400).json({
                    ok: false, 
                    error: {
                        message: 'Error al crear evento.'
                    }
                })
            }

            res.status(201).json({
                ok: true, 
                message: 'Evento creado correctamente'
            })

        } catch (error) {
            next(`No se puede procesar el request ${error}`)
        }
    }

}

module.exports = new EventsController;