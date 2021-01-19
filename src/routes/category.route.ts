import { Router } from 'express';
const router = Router();
const {checkToken, checkAdminRole} = require('../middlewares/auth.middleware');
const categoryController = require('../controllers/category.controller');


router.get('/category', [checkToken, checkAdminRole], categoryController.getAllCategories);
router.get('/category/:id', [checkToken, checkAdminRole], categoryController.getCategory);
router.post('/category', [checkToken, checkAdminRole], categoryController.createCategory);
router.put('/category/:id', [checkToken, checkAdminRole], categoryController.updateCategory);
router.delete('/category/:id', [checkToken, checkAdminRole], categoryController.enableDisableCategory);


module.exports = router;