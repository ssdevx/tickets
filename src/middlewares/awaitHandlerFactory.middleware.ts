import {Request, Response, NextFunction} from 'express';

const awaitHandlerFactory = (middleware: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await middleware(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = awaitHandlerFactory;
