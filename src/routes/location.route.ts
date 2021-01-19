import { Router } from 'express';

const router = Router();

const locationController = require('../controllers/location.controller');
const {checkToken, checkAdminRole} = require('../middlewares/auth.middleware');


router.get('/location', [checkToken, checkAdminRole], locationController.getAllLocations);
router.get('/location/:id', [checkToken, checkAdminRole], locationController.getLocationById);
router.post('/location', [checkToken, checkAdminRole], locationController.createLocation);
router.put('/location/:id', [checkToken, checkAdminRole], locationController.updateLocation); 
router.delete('/location/:id', [checkToken, checkAdminRole], locationController.enableDisableLocation);


module.exports = router;