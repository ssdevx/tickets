"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const { checkToken, checkAdminRole } = require('../middlewares/auth.middleware');
const subcategoryController = require('../controllers/subcategory.controller');
router.get('/subcategory', [checkToken, checkAdminRole], subcategoryController.getAllSubcategories);
router.get('/subcategory/:id', [checkToken, checkAdminRole], subcategoryController.getSubcategory);
router.post('/subcategory', [checkToken, checkAdminRole], subcategoryController.createSubcategory);
router.put('/subcategory/:id', [checkToken, checkAdminRole], subcategoryController.updateSubcategory);
router.delete('/subcategory/:id', [checkToken, checkAdminRole], subcategoryController.enableDisableSubcategory);
module.exports = router;
