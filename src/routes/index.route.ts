import { Router} from 'express';

//import usuarioRouter from './usuario';
//import sucursalRouter from './sucursal';
const locationRouter = require('./location.route');
const userRouter = require('./user.route');
const categoryRouter = require('./category.route');
const subcategoryRouter = require('./subcategory.route');
const ticketRouter = require('./ticket.route');
const eventRouter = require('./events.route');
 
const router = Router();    

//router.use('');
//router.use(usuarioRouter);
router.use(locationRouter);
router.use(userRouter);
router.use(categoryRouter);
router.use(subcategoryRouter);
router.use(ticketRouter);
router.use(eventRouter);


export default router;