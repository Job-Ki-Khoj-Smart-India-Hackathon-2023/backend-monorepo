import ApiError from "../../../helpers/models/api-error";
import UserRequest from "../../../helpers/models/user-request";
import JobseekerInfoModel from "../../../models/jobseeker-info-model";
import JobApplicationModel from "../../../models/jkk/jkk-job-application";
import { Response } from 'express';
import JkkJobPostModel from "../../../models/jkk/jkk-job-post";


/**
* Can only submit when application is open
*/
async function submit(req: UserRequest, res: Response){
	const {jkkJobPostId} = req.params as {jkkJobPostId: string};

	// Checking existence of job post
	const jkkJobPost = await JkkJobPostModel.findOne({
		_id: jkkJobPostId,
		'metadata.status': 'open'
	});
	if(!jkkJobPost){
		throw new ApiError(400, "Job post not available to apply");
	}

	// Checking and fetching user's profile info
	const userId = req.user!._id;
	const userProfile = await JobseekerInfoModel.findOne({
		userId
	});
	if(!userProfile){
		throw new ApiError(404, 'User profile not found. User must create profile first!');
	}

	// Checking if the user has already applied or not
	const anyPreviousJobApplication = await JobApplicationModel.findOne({
		jobseekerUserId: userId,
		jkkJobPostId
	});
	if(anyPreviousJobApplication){
		throw new ApiError(400, 'User already applied to the job post');
	}

	// applying to the job post
	const jkkJobApplication = new JobApplicationModel({
		jobseekerUserId: userId,
		jkkJobPostId,
		personalInfo: userProfile.personalInfo,
		contactInfo: userProfile.contactInfo,
		education: userProfile.education,
		experience: userProfile.experience,
		skills: userProfile.skills,
	});

	await jkkJobApplication.save();
	return res.status(200).send({message: "Job Application submitted successfully!"});
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
