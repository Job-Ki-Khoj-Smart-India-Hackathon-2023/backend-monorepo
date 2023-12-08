import ApiError from "../../../helpers/models/api-error";
import UserRequest from "../../../helpers/models/user-request"
import { Response } from 'express';


async function open(req: UserRequest, res: Response){
	throw new ApiError(500, "not implemented");
}

async function updateStatus(req: UserRequest, res: Response){
	throw new ApiError(500, "not implemented");
}

async function getJobs(req: UserRequest, res: Response){
	throw new ApiError(500, "not implemented");
}

async function getJobDetails(req: UserRequest, res: Response){
	throw new ApiError(500, "not implemented");
}
export {
	open,
	updateStatus,
	getJobs,
	getJobDetails
}
