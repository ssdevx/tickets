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
const EventsModel = require('../models/events.model');
const TicketModel = require('../models/ticket.model');
const moment = require('moment');
class EventsController {
    constructor() {
        this.createEvent = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const firtAnswer = yield TicketModel.previousOperation(req.body.id_ticket, 10);
                if (firtAnswer.primeraRespuesta === '0000-00-00 00:00:00') {
                    const fecha = moment().format('YYYY-MM-DD HH:mm:ss');
                    yield TicketModel.dateFirtAnswer(fecha, req.body.id_ticket);
                }
                const result = yield EventsModel.create(req.body);
                if (!result) {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: 'Error al crear evento.'
                        }
                    });
                }
                res.status(201).json({
                    ok: true,
                    message: 'Evento creado correctamente'
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
    }
}
module.exports = new EventsController;
