import UserSocket from "../helpers/models/user-socket";
import jwt from "jsonwebtoken";
import User from "../models/user-model";

const {JWT_SECRET} = process.env;
if(!JWT_SECRET){
	throw new Error('JWT_SECRET must be defined');
}

async function authSocketMiddleware(socket: UserSocket, next: (err?: any) => void) {
	const {authorization} = socket.request.headers;
	console.log(`auth authorization header = ${authorization}`);
	if(!authorization){
		return next(new Error('Authorization header not found'));
	}
	
	const token = authorization.split(' ')[1];
	console.log(`received token = ${token}`);
	if(!token){
		return next(new Error('Token not found'));
	}
	
	try{
		const decoded = jwt.verify(token, JWT_SECRET as string);
		const {userId} = typeof decoded === 'string' ? JSON.parse(decoded): decoded;
		const user = await User.findById(userId);
		if(!user){
			return next(new Error('User not found'));
		}
		console.log("User in socket",JSON.stringify(user));
		socket.user = user;
		next();
	}catch(err){
		return next(err);
	}
}


export default authSocketMiddleware;
