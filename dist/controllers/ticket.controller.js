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
const TicketModel = require('../models/ticket.model');
const moment = require('moment');
class TicketController {
    constructor() {
        this.getAllTicketsTec = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let ticketList = yield TicketModel.find({ id_usuario: req.body.id });
                if (!ticketList.length) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'No se encontraron tickets'
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    data: ticketList
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.getAllTicketsAdmin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let ticketList = yield TicketModel.find();
                if (!ticketList.length) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'No se encontraron tickets'
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    data: ticketList
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.getTicketById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield TicketModel.findOne({ id_ticket: req.params.id });
                if (!ticket) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'No se encontró ticket'
                        }
                    });
                }
                res.json({
                    ok: true,
                    data: ticket
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.getTicketByStatusAdmin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (Object.keys(req.body).length === 0) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'Argumentos no válidos'
                        }
                    });
                }
                const ticketList = yield TicketModel.findByStatus(req.body);
                if (!ticketList) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'No se encontró ticket'
                        }
                    });
                }
                res.json({
                    ok: true,
                    data: ticketList
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.getTicketByStatusTec = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (Object.keys(req.body).length === 0) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'Argumentos no válidos'
                        }
                    });
                }
                const ticketList = yield TicketModel.findByStatus(req.body);
                if (!ticketList) {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'No se encontró tickets'
                        }
                    });
                }
                res.json({
                    ok: true,
                    data: ticketList
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.createTicket = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Si se registra un ticket cerrado...
                (req.body.estatus === 4) ? req.body.cierre = moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm:ss') : req.body.cierre = '0000-00-00 00:00:00';
                const result = yield TicketModel.create(req.body);
                const alta = yield TicketModel.createTicketUsuario(result.insertId, req.body.alta || 0, 'ALTA');
                const atencion = yield TicketModel.createTicketUsuario(result.insertId, req.body.atencion || 0, 'ATENCION');
                const cliente = yield TicketModel.createTicketUsuario(result.insertId, req.body.cliente || 0, 'CLIENTE');
                Promise.all([result, alta, atencion, cliente]).then(() => {
                    res.status(201).json({
                        ok: true,
                        message: 'Ticket creado correctamente'
                    });
                }).catch(err => {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: `Error al crear ticket ${err}`
                        }
                    });
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.updateTicket = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield TicketModel.update(req.body, req.params.id);
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
                            message: 'Ticket no existe',
                            info
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    message: 'Ticket actualizado correctamente',
                    info
                });
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.changeStatusTicket = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                switch (req.body.estatus) {
                    //Cerrar -> si sus hijos estan cerrados o cancelados
                    case 4:
                        const childrenTicket = yield TicketModel.previousOperation(req.params.id, 4);
                        if (childrenTicket.hijos === 0) {
                            // Cerrar aquí
                            //req.body.cierre = moment().format('YYYY-MM-DD HH:mm:ss');
                            yield this.changeStatus(req, res);
                        }
                        else {
                            res.json({
                                ok: false,
                                error: {
                                    message: 'Error al cerrar el ticket, verificar que no tenga hijos abiertos'
                                }
                            });
                        }
                        break;
                    // Cancelar -> Si sus hijos están cerrados o resueltos
                    case 5:
                        const childrenTicketCancel = yield TicketModel.previousOperation(req.params.id, 5);
                        if (childrenTicketCancel.hijos === 0) {
                            yield this.changeStatus(req, res);
                        }
                        else {
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
                        const childrenTicketResolve = yield TicketModel.previousOperation(req.params.id, 6);
                        if (childrenTicketResolve.hijos === 0) {
                            //const changeStatus = await TicketModel.changeStatus(req.body.estatus, req.params.id);
                            yield this.changeStatus(req, res);
                        }
                        else {
                            res.json({
                                ok: false,
                                error: {
                                    message: 'Error al cambiar status de este ticket, verificar que todos los tickets hijos estén resueltos.'
                                }
                            });
                        }
                        break;
                    // Reabrir Ticket Un Ticket hijo se puede reabrir siempre y cuando el ticket padre tambien esté REABIERTO ó ABIERTO, ASIGNADO y PENDIENTE.
                    case 7:
                        const ref = yield TicketModel.previousOperation(req.params.id, 0);
                        if (ref.referencia === 0) {
                            yield this.changeStatus(req, res);
                        }
                        else {
                            const statusTicket = yield TicketModel.previousOperation(req.params.id, 7);
                            if (statusTicket.estatus !== 4) {
                                yield this.changeStatus(req, res);
                            }
                            else {
                                res.json({
                                    ok: false,
                                    error: {
                                        message: 'Error al reabrir el ticket, verifique que el ticket padre esté abierto'
                                    }
                                });
                            }
                        }
                        break;
                    default:
                        res.json({
                            ok: false,
                            error: {
                                message: 'Error al realizar la operacion'
                            }
                        });
                        break;
                }
            }
            catch (error) {
                next(`No se puede procesar el request ${error}`);
            }
        });
        this.changeStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let result;
            if (req.body.estatus === 4 || req.body.estatus === 7) {
                (req.body.estatus === 4) ? req.body.cierre = moment().format('YYYY-MM-DD HH:mm:ss') : req.body.cierre = '0000-00-00 00:00:00';
                result = yield TicketModel.changeStatusClose(req.body, req.params.id);
            }
            else {
                result = yield TicketModel.changeStatus(req.body.estatus, req.params.id);
            }
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
                        message: 'Ticket no existe',
                        info
                    }
                });
            }
            res.status(200).json({
                ok: true,
                message: 'Estatus actualizado correctamente',
                info
            });
        });
    }
}
module.exports = new TicketController;
