import { Server } from 'http';
import { Server as SocketServer } from 'socket.io';
import UserSocket from '../helpers/models/user-socket';
import socketMiddleware from '../middlewares/socket-middleware';
import { z } from 'zod';
import { isStringJsonParseable } from './utils';
import { getNearbyJobs, JobType } from './job-recommender';

async function initializeSocketConnection(expressServer: Server){
	const io = new SocketServer(expressServer, {});
	const userServer = io.of('/user');
	userServer.use(socketMiddleware);
	userServer.on('connection', (socket: UserSocket)=>{
		socket.on('coordinates', (data) =>{
			//console.log("Coordinates received", data);
			if(typeof data == 'string' && !isStringJsonParseable(data)){
				socket.emit('error', 'Invalid JSON format');
				return;
			}
			const parsedData = typeof data == 'string' ? JSON.parse(data) : data;
			//console.log(parsedData);
			try{
				z.object({lat: z.number(), lng: z.number(), range: z.number()}).parse(parsedData);
				// Get job posts relevant to the user
				getNearbyJobs(parsedData)
				.then((jobs)=>{
					socket.emit(`${JobType.JKK_JOB}s`, jobs[JobType.JKK_JOB]);
					socket.emit(`${JobType.PGRKAM_PRIVATE_JOB}s`, jobs[JobType.PGRKAM_PRIVATE_JOB]);
					//socket.emit('nearby-jobs', jobs);
				})
				.catch((err)=>{
					socket.emit('error', err);
				})
			}catch(err){
				if(err instanceof z.ZodError){
					socket.emit('error', err.issues);
				}else{
					socket.emit('error', err);		
				}
			}
		});
	});
}

export default initializeSocketConnection;
