import UserSocket from "../helpers/models/user-socket";

async function jobseekerSocketMiddleware(socket: UserSocket, next: (err?: any) => void){
	if(socket.user?.role !== 'jobseeker' && socket.user?.role !== 'admin') {
		next(new Error('Unauthorized'));
	}
	next();
}

export default jobseekerSocketMiddleware;
