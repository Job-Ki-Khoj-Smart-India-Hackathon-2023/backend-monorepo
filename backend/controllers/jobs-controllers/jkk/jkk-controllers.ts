import ApiError from "../../../helpers/models/api-error";
import UserRequest from "../../../helpers/models/user-request"
import { Response } from 'express';
import JkkJobPostModel from "../../../models/jkk/jkk-job-post";
import { JobType } from "../../../server/job-recommender";
import { redisManager } from "../../../clients/redis-client";


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

/**
*
*
* TODO check for errors
* previously giving errors when the userid didn't matched jobposter i.e. employers id
* hence was unable to update
*/
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
	if(jkkJobPost.employer?.userId != userId){
		throw new ApiError(401, 'Unauthorized');
	}

	await JkkJobPostModel.updateOne({_id: jkkJobPost._id}, {
		$set: {
			'metadata.status': status
		}
	});
	return res.status(200).send({"message": "Job Post updated successfully!"});
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
