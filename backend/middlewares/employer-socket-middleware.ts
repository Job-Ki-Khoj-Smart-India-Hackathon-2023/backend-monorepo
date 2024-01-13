import UserSocket from "../helpers/models/user-socket";

async function employerSocketMiddleware(socket: UserSocket, next: (err?: any) => void){
	if(socket.user?.role !== 'employer' && socket.user?.role !== 'admin') {
		next(new Error('Unauthorized'));
	}
	console.log(`user role in employer socket = ${socket.user?.role}`);
	next();
}


export default employerSocketMiddleware;

