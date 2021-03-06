import { Router } from 'express';

const router = Router();

const ticketController = require('../controllers/ticket.controller');
const { checkToken, checkAdminRole} = require('../middlewares/auth.middleware');


router.get('/ticket/tec', [checkToken], ticketController.getAllTicketsTec);
router.get('/ticket/admin', [checkToken, checkAdminRole], ticketController.getAllTicketsAdmin);
router.get('/ticket/statusadmin', [checkToken, checkAdminRole], ticketController.getTicketByStatusAdmin);
router.get('/ticket/statustec', [checkToken], ticketController.getTicketByStatusTec);
router.get('/ticket/:id', [checkToken], ticketController.getTicketById);
router.post('/ticket', [checkToken], ticketController.createTicket);
router.put('/ticket/:id', [checkToken, checkAdminRole], ticketController.updateTicket);
router.put('/ticket/status/:id', [checkToken], ticketController.changeStatusTicket);


//router.put('/sucursales/:id', sucursalController.updateSucursal); 
//router.delete('/sucursales/:id', sucursalController.deleteSucursal);


module.exports = router;