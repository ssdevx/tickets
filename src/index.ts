import Server from './server/server';
import router from './routes/index.route';
import express from 'express';


const server = Server.init(3000);

server.app.use(express.json());

server.app.use(router);



// MySQL instance
//MySQL.instance;

server.start(() => {
    console.log('Servidor corriendo en el puerto 3000');
}) 