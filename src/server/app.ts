import express, { Application } from 'express';

export class App {

    private app: Application;

    constructor(){
        this.app = express();
    }

    // Init Server
    async listen(){
        await this.app.listen(3000);
        console.log('Iniciado Puerto', 3000);
    }

}