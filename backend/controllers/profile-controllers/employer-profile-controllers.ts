import { Response } from 'express';
import UserRequest from "../../helpers/models/user-request";
import EmployerInfo from '../../models/employer-info-model';
import {uploadBuffer, deleteFile} from '../../clients/cloudinary-service';
import { CloudinaryFolderNames } from '../../helpers/cloudinary-config';


async function getProfile(req: UserRequest, res: Response){
	const user = req.user!!;
	const profile = await EmployerInfo.findOne({userId: user._id});
	if(!profile){
		return res.status(204).send({message: 'Profile not found'});
	}
	res.status(200).send({profile});
}

async function addProfile(req: UserRequest, res: Response){
	const user = req.user!!;
	const { personalInfo, contactInfo } = req.body;
	
	const isInfoAlreadyAdded = await EmployerInfo.findOne({userId: user._id});
	if(isInfoAlreadyAdded){
		return res.status(400).send({message: 'Profile already added'});
	}

	await EmployerInfo.create({
		userId: user._id,
		personalInfo,
		contactInfo
	});
	res.status(200).send({message: 'Profile created successfully'});
}

async function editPersonalInfo(req: UserRequest, res: Response){
	const user = req.user!!;
	const personalInfo = req.body.personalInfo;
	await EmployerInfo.updateOne({userId: user._id}, {$set: {personalInfo}});
	res.status(200).send({message: 'Personal info updated successfully'});
}


async function editContactInfo(req: UserRequest, res: Response){
	const user = req.user!!;
	const contactInfo = req.body.contactInfo;
	await EmployerInfo.updateOne({userId: user._id}, {$set: {contactInfo}});
	res.status(200).send({message: 'Contact info updated successfully'});
}


async function editProfilePic(req: UserRequest, res: Response){
	const user = req.user!!;

	const employer = await EmployerInfo.findOne({userId: user._id});
	if(!employer){
		return res.status(404).send({message: 'Employer info not found'});
	}

	const fileInfo = await uploadBuffer(req.file!!.buffer, CloudinaryFolderNames.PROFILE_IMAGES);
	if(!fileInfo){
		return res.status(500).send({message: 'Error uploading file'});
	}
	
	if(employer?.profilePic?.publicId){
		const response = await deleteFile(employer.profilePic.publicId);
		console.log(JSON.stringify(response));
	}
	await EmployerInfo.updateOne({userId: user._id}, {$set: {profilePic :{ url : fileInfo.secure_url, publicId: fileInfo.public_id}}});
	return res.status(200).send({message: 'Profile pic updated successfully'});
}

export {
	getProfile,
	addProfile,
	editPersonalInfo,
	editContactInfo,
	editProfilePic
};
