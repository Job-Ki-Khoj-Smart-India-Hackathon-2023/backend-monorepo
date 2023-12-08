import mlClient from '../../../clients/ml-grpc-client';
import { Empty } from '../../../generated/common';
import PrivateJob from "../../../models/pgrkam-models/PrivateJob";
import PublicJob from "../../../models/pgrkam-models/PublicJob";
import { Request, Response } from "express";
import ApiError from '../../../helpers/models/api-error';

async function getPrivateJob(req: Request, res: Response){
	const id = req.params.id;
	if(!id) {
		return res.status(400).json({message: "Id is required"});
	}
	const job = await PrivateJob.findById(id);	
	if(!job) {
		return res.status(404).json({message: "Job not found"});
	}
	return res.status(200).json({job});
}

async function getPrivateJobs(req: Request, res: Response){
	const { page, pageSize } = req.query as unknown  as {page:number, pageSize:number};
	const jobs = await PrivateJob.find().skip((page - 1) * pageSize).limit(pageSize);
	return res.status(200).json({jobs});
}


async function getPublicJob(req: Request, res: Response){
	const id = req.params.id;
	if(!id) {
		return res.status(400).json({message: "Id is required"});
	}
	const job = await PublicJob.findById(id);	
	if(!job) {
		return res.status(404).json({message: "Job not found"});
	}
	return res.status(200).json({job});
}

async function getPublicJobs(req: Request, res: Response){
	const { page, pageSize } = req.query as unknown  as {page:number, pageSize:number};
	const jobs = await PublicJob.find().skip((page - 1) * pageSize).limit(pageSize);
	return res.status(200).json({jobs});
}

async function getPublicJobRecommendations(_: Request, res: Response){
	throw new ApiError(500, "not implemented");
}

async function getPrivateJobRecommendations(_: Request, res: Response){
	try{
		mlClient.GetPGRKAMPrivateJobs(new Empty(), (error, response)=>{
			if(error) {
				return res.status(500).send({message: error.message});
			}
			res.status(200).send({jobs: response?.toObject});
		});
	}catch(error){
		console.log(error);
	}
}

export {
	getPrivateJob,
	getPrivateJobs,
	getPublicJob,
	getPublicJobs,
	getPrivateJobRecommendations,
	getPublicJobRecommendations
}
