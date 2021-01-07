"use strict";
var express = require('express');
var router = express.Router();
var sucursalController = require('../controllers/sucursal.controller');
router.get('/sucursales', sucursalController.getAllSucursales);
module.exports = router;
