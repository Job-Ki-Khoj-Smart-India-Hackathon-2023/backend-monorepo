import { Request, Response, NextFunction } from 'express';


const supportedMimeTypes = [
	'image/jpeg',
	'image/png',
	'image/jpg',
];

function profilePicMiddleware (
	req: Request, res: Response, next: NextFunction
){
	if(!req.file){
		res.status(400).send({error: "'pic' file missing!"});
		return;
	}
	if(!supportedMimeTypes.includes(req.file.mimetype)){
		res.status(400).send({error: "Only jpeg, jpg and png files are supported"});
		return;
	}
	next();
}

function optionalProfilePicMiddleware (
	req: Request, res: Response, next: NextFunction
){
	if(!req.file){
		next();
		return;
	}

	if(!supportedMimeTypes.includes(req.file.mimetype)){
		res.status(400).send({error: "Only jpeg, jpg and png files are supported"});
		return;
	}

	next();
}

export {
	profilePicMiddleware,
	optionalProfilePicMiddleware
};
