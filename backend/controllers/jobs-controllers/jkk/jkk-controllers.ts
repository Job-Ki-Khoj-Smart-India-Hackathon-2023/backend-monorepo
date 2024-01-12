import ApiError from "../../../helpers/models/api-error";
import UserRequest from "../../../helpers/models/user-request"
import { Response } from 'express';
import JkkJobPostModel from "../../../models/jkk/jkk-job-post";
import { JobType } from "../../../server/job-recommender";
import { redisManager } from "../../../clients/redis-client";

const JKKJobStatus = {
	'open': 0,
	'under-review': 1,
	'interviewing': 2,
	'closed': 3
};
Object.freeze(JKKJobStatus);

async function open(req: UserRequest, res: Response){
	const {companyName, location, jobInfo, tags} = req.body as {
		location: {lat: number, lng: number} | undefined,
		jobInfo: any,
		companyName: string,
		tags: [string] | undefined
	};

	const userId = req.user?._id;
	if(!userId){
		throw new ApiError(401, "Invalid request due to missing userid");
	}
	const rawJobPost: {
		metadata: {
			location: {
				type: string,
				coordinates: [number, number]
			},
			status: string
		} | undefined;
		employer: {
			userId: string;
		};
		companyName: string;
		jobInfo: any;
		tags: [string] | undefined;
	} = {
			metadata: undefined,
			employer:{
				userId,
			},
			companyName,
			jobInfo,
			tags
	};

	if(location){
		rawJobPost.metadata = {
			location: {
				type: 'Point',
				coordinates: [location.lng, location.lat]
			},
			status: 'open'
		};
	};
	const jobPost = new JkkJobPostModel(rawJobPost);
	const promises = [];
	promises.push(jobPost.save());
	if(location){
		const geoJobPost = {
			member: jobPost._id.toString(),
			longitude: location.lng,
			latitude: location.lat
		};
		promises.push(redisManager.addGeoJobPost(geoJobPost));
	}
	const contentJobPost = {
		id: jobPost._id.toString(),
		data: JSON.stringify({
			...jobPost.toObject(),
			metadata: {
				...jobPost.metadata,
				jobType: JobType.JKK_JOB
			}
		})
	};
	promises.push(redisManager.setContentJobPost(contentJobPost));
	await Promise.all(promises);
	return res.status(200).send({"message": "Job Post opened successfully!"});
}

async function updateStatus(req: UserRequest, res: Response){
	const userId = req.user?._id;
	if(!userId){
		throw new ApiError(401, "Invalid request due to missing userid");
	}

	const { jkkJobPostId } = req.params as {jkkJobPostId: string};
	const {status} = req.query as {
		status: 'under-review' | 'interviewing' | 'closed'
	};

	console.log('jkkJobPostId', jkkJobPostId);
	console.log('status', status);

	const jkkJobPost = await JkkJobPostModel.findOne({_id: jkkJobPostId}).exec();
	if(!jkkJobPost){
		throw new ApiError(404, 'Job Post not found');
	}

	console.log('current userid =', userId);
	console.log('post userid =', jkkJobPost.employer?.userId);
	if(jkkJobPost.employer?.userId.toString() !== userId.toString()){
		throw new ApiError(401, 'Unauthorized');
	}

	if(JKKJobStatus[status] <= JKKJobStatus[jkkJobPost.metadata!.status]){
		throw new ApiError(400, 'Status not allowed');
	}

	if(status === 'closed'){
		await Promise.all([
			redisManager.delGeoJobPost(jkkJobPostId),
			redisManager.delContentJobPost(jkkJobPostId)
		]);
		console.log('jkk job post is removed from redis');
	}

	await JkkJobPostModel.updateOne({_id: jkkJobPost._id}, {
		$set: {
			'metadata.status': status
		}
	});
	return res.status(200).send({"message": "Job Post updated successfully!"});
}

async function getJobDetails(req: UserRequest, res: Response){
	const { jkkJobPostId } = req.params as {jkkJobPostId: string};
	const jkkJobPost = await JkkJobPostModel.findOne({_id: jkkJobPostId});
	if(!jkkJobPost){
		throw new ApiError(404, 'Job Post not found');
	}
	return res.status(200).send(jkkJobPost);
}

/* *
	* For jobseekers to see the available jobs
	*/
async function getOpenJobs(req: UserRequest, res: Response){
	let { page, pageSize, sort } = req.query as unknown as {
		page: number,
		pageSize:number,
		sort: 'asc'|'dsc'
	};
	const jkkJobPosts = await JkkJobPostModel
		.find({'metadata.status': 'open'})
		.skip(page*pageSize)
		.limit(pageSize)
		.sort({updatedAt: (sort==='asc')?1:-1});
	return res.status(200).send(jkkJobPosts);
}

async function getEmployerJobs(req: UserRequest, res: Response){
	const userId = req.user!._id!;
	let { page, pageSize, sort } = req.query as unknown as {
		page: number,
		pageSize: number,
		sort: 'asc' | 'dsc'
	};
	const jkkJobPosts = await JkkJobPostModel
		.find({'employer.userId': userId})
		.skip(page*pageSize)
		.limit(pageSize)
		.sort({updatedAt: (sort==='asc')?1:-1});
	return res.status(200).send(jkkJobPosts);
}

export {
	open,
	updateStatus,
	getOpenJobs,
	getJobDetails,
	getEmployerJobs
}
