import ApiError from "../../../helpers/models/api-error";
import UserRequest from "../../../helpers/models/user-request";
import { Response } from 'express';

async function submit(req: UserRequest, res: Response){
	throw new ApiError(500, "not implemented");
}

async function revoke(req: UserRequest, res: Response){
	throw new ApiError(500, "not implemented");
}

async function getApplications(req: UserRequest, res: Response){
	throw new ApiError(500, "not implemented");
}

async function getApplicationDetails(req:	 UserRequest, res: Response){
	throw new ApiError(500, "not implemented");
}

export {
	submit,
	revoke,
	getApplications,
	getApplicationDetails
}
