import { Router } from 'express';

const router = Router();

const categoryController = require('../controllers/categoria.controller');


router.get('/categoria', categoryController.getAllCategories);
router.get('/categoria/:id', categoryController.getCategory);
router.post('/categoria', categoryController.createCategory);



module.exports = router;