import { config } from 'dotenv';
import startApp from './app';
import { dbManager } from "./config/db";

config()

const port = +(process.env.PORT || 8080);


let server: any;
let sockets: Set<any> = new Set();

dbManager
    .connect()
    .then(async () => {
        console.log('Connected to Database');
        server = startApp(port); // in our case, db is not necessarily available but server should connect after db connection

        server.timeout = 55000;

        server.on('timeout', (socket:any) => {
            console.log('===================================Request Ended=======================================');
            socket.destroy();
        });

        // Track open sockets
        server.on('connection', (socket: any) => {
            sockets.add(socket);
            socket.on('close', () => sockets.delete(socket));
        });
    })
    .catch((err) => console.log("error from herer " ,err));


const gracefulShutdown = (error?: any) => {
    if (error) {
        console.error('Error:', error);
    }
    if (server) {
        server.close(() => {
            console.log('Server closed');
            dbManager.close();
            // Destroy all open sockets
            sockets.forEach((socket) => socket.destroy());
            process.exit(1);
        });
        // In case server.close hangs, force exit after 10s
        setTimeout(() => process.exit(1), 10000);
    } else {
        process.exit(1);
    }
};

// Handle process signals and exceptions
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('uncaughtException', gracefulShutdown);
process.on('unhandledRejection', gracefulShutdown);
