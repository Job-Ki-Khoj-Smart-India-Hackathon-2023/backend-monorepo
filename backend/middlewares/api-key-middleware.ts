import { Request, Response, NextFunction } from 'express';
import ApiError from '../helpers/models/api-error';
import ApiKey from '../models/api-key-model';


async function apiKeyMiddleware(req: Request, res: Response, next: NextFunction){
	const { apiKey } = req.query;	
	if(!apiKey){
		throw new ApiError(401, 'API key is required');	
	}
	const isApiKeyValid = await ApiKey.findOne({apiKey});
	if(!isApiKeyValid){
		throw new ApiError(401, 'Invalid API key');
	}
	next();
}
export default apiKeyMiddleware;
