import { Router} from 'express';

//import usuarioRouter from './usuario';
//import sucursalRouter from './sucursal';
const userRouter = require('./sucursal.route');

const router = Router();    

//router.use('');
//router.use(usuarioRouter);
router.use(userRouter);


export default router;