"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const { checkToken } = require('../middlewares/auth.middleware');
const eventController = require('../controllers/events.controller');
router.post('/ticket/event', [checkToken], eventController.createEvent);
module.exports = router;
