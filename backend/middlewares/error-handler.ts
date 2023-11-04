import { Request, Response, NextFunction } from 'express';
import ApiError from '../helpers/models/api-error';
import { MulterError } from 'multer';
import { FILE_SIZE } from './../helpers/multer-config';


type CustomError = Error | ApiError; 

function errorHandler (
	err: CustomError, req: Request, res: Response, next: NextFunction
){
	console.log(`caught error ${err.message}`);
	if(err instanceof ApiError){
		res.status(err.status).send({error: err.message});
		return;
	}else if(err instanceof MulterError){
		res.status(400).send({error: `${err.message}`});//: File size should be less than ${FILE_SIZE/(1024*1024)} mb`});
		return;
	}
	console.log(err);
	res.status(500).send({error: "Something went wrong"});
}

export default errorHandler;
