import { Server } from 'http';
import { Server as SocketServer} from 'socket.io';
import setupJobseekerServer from './jobseeker/jobseeker';
import authSocketMiddleware from '../middlewares/auth-socket-middleware';
import setupEmployerServer from './employer/employer';

async function initializeSocketConnection(expressServer: Server){
	const io = new SocketServer(expressServer, {});
	
	const jobseekerServer = io.of('/jobseeker');
	setupJobseekerServer(jobseekerServer);

	const employerServer = io.of('/employer');
	setupEmployerServer(employerServer);
}

export default initializeSocketConnection;
