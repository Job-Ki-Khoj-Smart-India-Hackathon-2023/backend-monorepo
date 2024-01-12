import ApiError from "../../../helpers/models/api-error";
import UserRequest from "../../../helpers/models/user-request";
import JobseekerInfoModel from "../../../models/jobseeker-info-model";
import JobApplicationModel from "../../../models/jkk/jkk-job-application";
import { Response } from 'express';
import JkkJobPostModel from "../../../models/jkk/jkk-job-post";


/**
* Can only submit when application is open (only for jobseeker)
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

/* *
	* Remove the submitted application ( only for jobseeker )
	*/
async function revoke(req: UserRequest, res: Response){
	const userId = req.user!._id;
	const {jkkJobPostId} = req.params as {jkkJobPostId: string};

	const jkkJobApplication = await JobApplicationModel.findOne({
		jobseekerUserId: userId,
		jkkJobPostId
	});
	if(!jkkJobApplication){
		throw new ApiError(404, "Application not found");
	}
	await jkkJobApplication.deleteOne();
	return res.status(200).send({message: "Job Application redacted succesfully"});
}

/* *
	* Get applications under a particular job post
	* only accessible to the employer who posted that job post
	*/
async function getApplications(req: UserRequest, res: Response){
	const userId = req.user!._id;
	const {jkkJobPostId} = req.params as {jkkJobPostId: string};
	const {page, pageSize, sort} = req.query as unknown as {
		page: number,
		pageSize: number,
		sort: 'asc'|'dsc'
	};

	// Verify the job post belongs to requesting employer
	const jkkJobPost = await JkkJobPostModel.findOne({
		_id: jkkJobPostId,
		'employer.userId': userId,
	});
	if(!jkkJobPost){
		throw new ApiError(404, "Job post not found!");
	}

	// Fetch corresponding applications
	const jkkJobApplications = await JobApplicationModel.find({
		jkkJobPostId
	}).skip(page*pageSize).limit(page).sort({createdAt: (sort=='asc')?1:-1});

	return res.status(200).send(jkkJobApplications);
}

/* *
	* Get particular application details 
	* (only for employer)
	*/
async function getApplicationDetails(req:	 UserRequest, res: Response){
	const userId = req.user!._id;
	const {jkkJobPostId, applicationId} = req.params as {
		jkkJobPostId: string,
		applicationId: string
	};

	// Verify the job post belongs to requesting employer
	const jkkJobPost = await JkkJobPostModel.findOne({
		_id: jkkJobPostId,
		'employer.userId': userId,
	});
	if(!jkkJobPost){
		throw new ApiError(404, "Job post not found!");
	}

	// Fetch job application 
	const jkkJobApplication = await JobApplicationModel.findOne({
		_id: applicationId,
		jkkJobPostId
	});
	if(!jkkJobApplication){
		throw new ApiError(404, "Job application not found");
	}
	return res.status(200).send(jkkJobApplication);
}

export {
	submit,
	revoke,
	getApplications,
	getApplicationDetails
}
