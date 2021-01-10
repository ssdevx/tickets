"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = express_1.Router();
var subcategoryController = require('../controllers/subcategory.controller');
router.get('/subcategoria', subcategoryController.getAllSubCategories);
router.get('/subcategoria/:id', subcategoryController.getSubCategory);
router.post('/subcategoria', subcategoryController.createSubCategory);
module.exports = router;
