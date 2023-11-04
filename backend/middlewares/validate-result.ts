import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

function validateResult(req: Request, res: Response, next: NextFunction){
	console.log("validateResult");
	const errors = validationResult(req);	
	if(!errors.isEmpty()){
		return res.status(400).send({
			message: "Invalid request",
			errors: errors.array()
		});
	}
	next();
}


export default validateResult;
