import cors from 'cors';
import express from 'express';
import morganMiddleware from './config/morgan';


export const app: express.Express = express();

// Basic CORS setup
const corsOptions = {
  origin: true, // or specify domains: ['http://example.com']
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

app.use(express.json({ limit: '50mb' })); // Middleware to parse JSON bodies
app.use(cors());
// app.options('*', cors());     // have issue so need to see documentation 

app.use(morganMiddleware);


const startApp = (port: number) =>
    app.listen(port, () => {
        console.log(`Express is listening at ${port}`);
    }
);


export default startApp;
