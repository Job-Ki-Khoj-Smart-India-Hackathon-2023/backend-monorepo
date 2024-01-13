import {Namespace} from 'socket.io';
import UserSocket from '../../helpers/models/user-socket';
import jobseekerSocketMiddleware from '../../middlewares/jobseeker-socket-middleware';
import handleCoordinatesEvent from './event-handler/coordinates';
import authSocketMiddleware from '../../middlewares/auth-socket-middleware';

function setupJobseekerServer(jobseekerServer: Namespace){
	jobseekerServer.use(authSocketMiddleware);
	jobseekerServer.use(jobseekerSocketMiddleware);
	jobseekerServer.on('connection', (socket: UserSocket)=>{
		socket.on('jobseeker:health', ()=>{
			console.log(`health check requested by ${socket.user?._id}`);
			socket.emit('jobseeker:health', "I'm Okay");
		});
		socket.on('jobseeker:coordinates', (data) =>{
			handleCoordinatesEvent(socket, data);
		});
	});
}

export default setupJobseekerServer;
