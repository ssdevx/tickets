const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursal.controller');


router.get('/sucursales', sucursalController.getAllSucursales);
router.get('/sucursales/:id', sucursalController.getSucursalById);
// router.post('/sucursales', function(req, res){
//     sucursalController.Create
// });

router.post('/sucursales', sucursalController.createSucursal);
//router.get('/id/:id', auth(), awaitHandlerFactory(userController.getUserById)); // localhost:3000/api/v1/users/id/1

router.put('/sucursales/:id', sucursalController.updateSucursal); // localhost:3000/api/v1/users/id/1
router.delete('/sucursales/:id', sucursalController.deleteSucursal);




module.exports = router;