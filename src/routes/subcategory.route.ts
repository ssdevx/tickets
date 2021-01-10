import { Router } from 'express';

const router = Router();

const subcategoryController = require('../controllers/subcategory.controller');


router.get('/subcategoria', subcategoryController.getAllSubCategories);
router.get('/subcategoria/:id', subcategoryController.getSubCategory);
router.post('/subcategoria', subcategoryController.createSubCategory);



module.exports = router;