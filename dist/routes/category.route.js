"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = express_1.Router();
var categoryController = require('../controllers/categoria.controller');
router.get('/categoria', categoryController.getAllCategories);
router.get('/categoria/:id', categoryController.getCategory);
router.post('/categoria', categoryController.createCategory);
module.exports = router;
