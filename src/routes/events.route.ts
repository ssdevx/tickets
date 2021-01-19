import { Router } from 'express';
const router = Router();
const {checkToken} = require('../middlewares/auth.middleware');
const eventController = require('../controllers/events.controller');


router.post('/ticket/event', [checkToken], eventController.createEvent);


module.exports = router;
