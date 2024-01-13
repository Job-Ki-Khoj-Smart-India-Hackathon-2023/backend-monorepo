import {Namespace} from 'socket.io';
import employerSocketMiddleware from '../../middlewares/employer-socket-middleware';
import UserSocket from '../../helpers/models/user-socket';
import authSocketMiddleware from '../../middlewares/auth-socket-middleware';
import handleCoordinatesEvent from './event-handler/coordinates';


function setupEmployerServer(employerServer: Namespace){
	employerServer.use(authSocketMiddleware);
	employerServer.use(employerSocketMiddleware);
	employerServer.on('connection', (socket: UserSocket)=>{

		// for checking health of this namespace
		socket.on('employer:health', ()=>{
			console.log(`health check requested by ${socket.user?._id}`);
			socket.emit('employer:health', "I'm Okay");
		});

		// for fetching nearby jobseekers
		socket.on('employer:coordinates', (data)=>{
			handleCoordinatesEvent(socket, data);
		})
	});
}


export default setupEmployerServer;
