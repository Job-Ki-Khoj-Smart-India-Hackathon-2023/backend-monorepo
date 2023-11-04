import { Response } from 'express';
import UserRequest from '../../helpers/models/user-request';
import JobseekerInfo from '../../models/jobseeker-info-model';
import ApiError from '../../helpers/models/api-error';
import { uploadBuffer, deleteFile } from '../../clients/cloudinary-service';
import { CloudinaryFolderNames } from '../../helpers/cloudinary-config';

async function getProfile(req: UserRequest, res: Response){
	const user = req.user!!;
	const profile = await JobseekerInfo.findOne({userId: user._id});
	if(!profile){
		return res.status(204).send({message: 'Profile not found'});
	}
	res.status(200).send({profile});
}

async function addProfile(req: UserRequest, res: Response){
	const user = req.user!!;
	const isInfoAlreadyAdded = await JobseekerInfo.findOne({userId: user._id});
	if(isInfoAlreadyAdded){
		throw new ApiError(409, 'Profile already added');
	}
	const { personalInfo, contactInfo, education, experience, skills } = req.body;
	await JobseekerInfo.create({
		userId: user._id,
		personalInfo,
		contactInfo,
		education,
		experience,
		skills
	});
	res.status(200).send({message: 'Profile created successfully'});
}

async function addExperience(req: UserRequest, res: Response){
	const user = req.user!!;
	const exp = req.body.experience;
	await JobseekerInfo.updateOne({userId: user._id}, {$push: {experience: exp}});
	res.status(200).send({message: 'Experience added successfully'});
}

async function deleteExperience(req: UserRequest, res: Response){
	const expId = req.params.id!!;
	const user = req.user!!;

	await JobseekerInfo.updateOne({userId: user._id}, {$pull: {experience: {_id: expId}}});
	res.status(200).send({message: 'Experience deleted successfully'});
}

async function editExperience(req: UserRequest, res: Response){
	const expId = req.params.id!!;
	const user = req.user!!;
	const exp = { ...req.body.experience, _id: expId };

	const oldExp = await JobseekerInfo.findOne({experience: {$elemMatch: {_id: expId}}});
	if(!oldExp){
		return res.status(404).send({message: 'Experience not found'});
	}
	await JobseekerInfo.updateOne({userId: user._id, 'experience._id': expId}, {$set: {'experience.$': exp}});
	res.status(200).send({message: 'Experience edited successfully'});
}

async function clearExperience(req: UserRequest, res: Response){
	const user = req.user!!;
	await JobseekerInfo.updateOne({userId: user._id}, {$set: {experience: []}});
	res.status(200).send({message: 'Experience cleared successfully'});
}

async function addEducation(req: UserRequest, res: Response){
	const user = req.user!!;
	const edu = req.body.education;
	await JobseekerInfo.updateOne({userId: user._id}, {$push: {education: edu}});
	res.status(200).send({message: 'Education added successfully'});
}

async function deleteEducation(req: UserRequest, res: Response){
	const user = req.user!!;
	const eduId = req.params.id!!;
	await JobseekerInfo.updateOne({userId: user._id}, {$pull: {education: {_id: eduId}}});
	res.status(200).send({message: 'Education deleted successfully'});
}

async function editEducation(req: UserRequest, res: Response){
	const user = req.user!!;	
	const eduId = req.params.id!!;
	const edu = {...req.body.education, _id: eduId};

	const oldEdu = await JobseekerInfo.findOne({education: {$elemMatch: {_id: eduId}}});
	if(!oldEdu){
		return res.status(404).send({message: 'Education not found'});	
	}
	await JobseekerInfo.updateOne({userId: user._id, 'education._id': eduId}, {$set: {'education.$': edu}});
	res.status(200).send({message: 'Education edited successfully'});
}

async function clearEducation(req: UserRequest, res: Response){
	const user = req.user!!;
	await JobseekerInfo.updateOne({userId: user._id}, {$set: {education: []}});
	res.status(200).send({message: 'Education cleared successfully'});
}

async function editSkills(req: UserRequest, res: Response){
	const user = req.user!!;
	const skills = req.body.skills;
	await JobseekerInfo.updateOne({userId: user._id}, {$set: {skills}});
	res.status(200).send({message: 'Skills edited successfully'});
}

async function editPersonalInfo(req: UserRequest, res: Response){
	const user = req.user!!;
	const personalInfo = req.body.personalInfo;
	await JobseekerInfo.updateOne({userId: user._id}, {$set: {personalInfo}});
	res.status(200).send({message: 'Personal info updated successfully'});
}

async function editContactInfo(req: UserRequest, res: Response){
	const user = req.user!!;
	const contactInfo = req.body.contactInfo;
	await JobseekerInfo.updateOne({userId: user._id}, {$set: {contactInfo}});
	res.status(200).send({message: 'Contact info updated successfully'});
}


async function editProfilePic(req: UserRequest, res: Response){
	const user = req.user!!;

	const jobseekerInfo = await JobseekerInfo.findOne({userId: user._id});
	if(!jobseekerInfo){
		return res.status(404).send({message: 'Jobseeker info not found'});
	}

	const fileInfo = await uploadBuffer(req.file!!.buffer, CloudinaryFolderNames.PROFILE_IMAGES);
	if(!fileInfo){
		return res.status(500).send({message: 'Error uploading file'});
	}
	
	if(jobseekerInfo?.profilePic?.publicId){
		const response = await deleteFile(jobseekerInfo.profilePic.publicId);
		console.log(JSON.stringify(response));
	}
	await JobseekerInfo.updateOne({userId: user._id}, {$set: {profilePic :{ url : fileInfo.secure_url, publicId: fileInfo.public_id}}});
	return res.status(200).send({message: 'Profile pic updated successfully'});
}

export{
	getProfile,
	addProfile,
	addExperience,
	deleteExperience,
	editExperience,
	clearExperience,
	addEducation,
	deleteEducation,
	editEducation,
	clearEducation,
	editSkills,
	editPersonalInfo,
	editContactInfo,
	editProfilePic
}
