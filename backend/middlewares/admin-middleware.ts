import { Response, NextFunction } from 'express';
import UserRequest from '../helpers/models/user-request';
import jwt from 'jsonwebtoken';
import ApiError from '../helpers/models/api-error';
import User from '../models/user-model';

const { JWT_SECRET } = process.env;
if(!JWT_SECRET){
	throw new Error('No JWT_SECRET env variable found');
}

async function adminMiddleware(req: UserRequest, res: Response, next: NextFunction){
	const { authorization } = req.headers;
	if(!authorization){
		throw new ApiError(401, 'No authorization header found');
	}

	if(authorization.indexOf('Bearer') === -1){
		throw new ApiError(401, 'Invalid authorization header');
	}

	const token = authorization.split(' ')[1];

	if(!token){
		throw new ApiError(401, 'No token found');
	}
	try{
		const decoded = jwt.verify(token, JWT_SECRET as string);
		const {userId} = typeof decoded === 'string'? JSON.parse(decoded as string) : decoded;
		const user = await User.findById(userId);
		if(!user){
			throw new ApiError(401, 'Invalid token');
		}
		if(user.role !== 'admin'){
			throw new ApiError(401, 'You are not an admin');
		}
		req.user = user;
		//req.userId = userId;
		next();
	}catch(e){
		throw new ApiError(401, 'Invalid token');
	}
}

export default adminMiddleware;
