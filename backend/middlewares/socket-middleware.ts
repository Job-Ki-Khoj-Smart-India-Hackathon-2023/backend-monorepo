import UserSocket from "../helpers/models/user-socket";
import jwt from "jsonwebtoken";

const {JWT_SECRET} = process.env;
if(!JWT_SECRET){
	throw new Error('JWT_SECRET must be defined');
}

async function socketMiddleware(socket: UserSocket, next: (err?: any) => void) {
	const {authorization} = socket.request.headers;
	if(!authorization){
		return next(new Error('Authorization header not found'));
	}
	
	const token = authorization.split(' ')[1];
	if(!token){
		return next(new Error('Token not found'));
	}
	
	try{
		const decoded = jwt.verify(token, JWT_SECRET as string);
		const {userId} = typeof decoded === 'string' ? JSON.parse(decoded): decoded;
		socket.userId = userId;
		next();
	}catch(err){
		return next(err);
	}
}


export default socketMiddleware;
