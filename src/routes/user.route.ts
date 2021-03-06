import { Router } from 'express';

const router = Router();

const userController = require('../controllers/user.controller');
const { checkToken, checkAdminRole } = require('../middlewares/auth.middleware');

//const { validateLogin } = require('../middlewares/validators/usuarioValidator.middleware');

router.get('/user', [checkToken, checkAdminRole], userController.getAllUsers);
router.get('/user/:id', [checkToken, checkAdminRole], userController.getUserById);
router.post('/user', [checkToken, checkAdminRole], userController.createUser);
router.put('/user/:id', [checkToken, checkAdminRole], userController.updateUser);
router.delete('/user/:id', [checkToken], userController.enableDisableUser);
router.put('/user/password/:id', [checkToken], userController.changePassword);


router.post('/login', userController.userLogin);


module.exports = router;