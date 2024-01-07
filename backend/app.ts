import dotenv from 'dotenv';
console.log(`Node env = ${process.env.NODE_ENV}`);
const envFile = process.env.NODE_ENV === 'production'? '.env.prod' : '.env.dev';
const envPath = `./${envFile}`;
console.log(`envPath = ${envPath}`);
dotenv.config({path: envPath});

import mongoose from 'mongoose';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import errorHandler from './middlewares/error-handler';
import userRouter from './routes/user/user-routes';
import cronRouter from './routes/cron-routes';
import jobsRouter from './routes/jobs-routes';
import initializeSocketConnection from './server/socket';
import './helpers/cloudinary-config';

console.log(`NODE_ENV = ${process.env.NODE_ENV} and changes implemented and hello world from anurag`);
const MONGO_URI = process.env.NODE_ENV === 'production'? process.env.PROD_MONGO_URI : process.env.MONGO_URI;

if(!MONGO_URI){
	throw new Error('MONGO_URI must be defined');
}

mongoose.connect(MONGO_URI)
.then(()=>{
	console.log('Connected to MongoDB');
})
.catch((err)=>{
	console.error(err);
});


const app = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';
const API_PREFIX = `/api/${API_VERSION}`;
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get(`${API_PREFIX}/health`, (_, res)=>{ res.status(200).send({message: 'OK'}); });
app.use(`${API_PREFIX}/user`, userRouter);
app.use(`${API_PREFIX}/cron`, cronRouter);
app.use(`${API_PREFIX}/jobs`, jobsRouter);

app.use(errorHandler);

const server = app.listen(PORT, ()=>{
	console.log(`Listening on port ${PORT}`);
});
initializeSocketConnection(server);
