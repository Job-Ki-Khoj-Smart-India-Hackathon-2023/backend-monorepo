import { Request, Response } from "express";
import User from "../models/user-model";
import ApiError from "../helpers/models/api-error";
import { sendMail } from '../clients/mail-service';
import shortUUID from 'short-uuid';
import ApiKey from "../models/api-key-model";
import { generateOtp } from "../helpers/otp-generator";
import { redisManager } from "../clients/redis-client";


const OTP_EXPIRY = 10 * 60; // 10 minutes
const OTP_LENGTH = 6;	

async function login(req: Request, res: Response){
	const { email, password } = req.body;
	const user = await User.findOne({email});
	if(!user){
		throw new ApiError(404, 'User not found');
	}
	const isPasswordValid = user.comparePassword(password);
	if(!isPasswordValid){
		throw new ApiError(401, 'Invalid password');
	}
	const token = user.generateToken();

	res.status(200).send({token});
}

async function signUp(req: Request, res: Response){
	const {username, email, password, role } = req.body;
	console.log('req.body', JSON.stringify(req.body));
	const user = await User.findOne({email});
	if(user){
		throw new ApiError(409, 'User already exists');
	}

	const otp = generateOtp(OTP_LENGTH);
	const data = JSON.stringify({
		username, email, password, role,
		purpose: 'SIGNUP'
	});

	await redisManager.setVerificationData(otp, data, OTP_EXPIRY);


	try{		
		await sendMail({
			email,
			subject: 'Welcome to Job-Ki-Khoj! Confirm Your Account to Get Started',
			message: `
			Hello,

			Your OTP (One-Time Password) for verification on Job Ki Khoj is: ${otp}

			This OTP is valid for the next ${OTP_EXPIRY/60} minutes. Please use it to complete your registration or verification process on our platform.

			If you did not request this OTP, please disregard this email.

			Thank you for choosing Job Ki Khoj!

			Best Regards,
			The Job Ki Khoj Team
			  `
		});
	}catch(err){
		await redisManager.delVerificationData(otp);
		console.log(err);
		throw new ApiError(500, "Server unable to send mail!");
	}
	res.status(200).send({message: "OTP Sent Successfully"});
}


async function forgotPassword(req: Request, res: Response){
	const {email, password}: {email: string, password: string} = req.body;
	const user = await User.findOne({email});
	if(!user){
		throw new ApiError(404, "User not found!");
	}
	
	const otp = generateOtp(OTP_LENGTH);

	//const redisKey = RedisKeyManager.getOTPVerificationKey(otp);
	const data = JSON.stringify({
		email, password, purpose: 'FORGOT_PASSWORD'
	});

	await redisManager.setVerificationData(otp, data, OTP_EXPIRY);

	try{
		sendMail({
			email,
			subject: "Reset Your Password for Your Job-Ki-Khoj Account",
			message: `
			Hello,

			You have requested to reset your password on Job Ki Khoj. Your OTP (One-Time Password) for verification is: ${otp}

			This OTP is valid for the next ${OTP_EXPIRY/60} minutes. Please use it to reset your password. If you did not request this password reset, please ignore this email.

			Thank you for choosing Job Ki Khoj!

			Best Regards,
			The Job Ki Khoj Team
			`
		});
	}catch(err){
		console.log(err);
		await redisManager.delVerificationData(otp);
		throw new ApiError(500, "Server unable to send mail!");
	}

	res.status(200).send({message: "OTP sent successfully!"});
}

async function verifyOTP(req: Request, res: Response){
	const { otp } = req.params as { otp: string };
	
	const userData = await redisManager.getVerificationData(Number(otp));
	if(!userData){
		throw new ApiError(404, 'Invalid otp');
	}
	await redisManager.delVerificationData(Number(otp));

	const userRequest = JSON.parse(userData);
	const { role, email, password } = userRequest;

	if(userRequest.purpose === 'FORGOT_PASSWORD'){
		const user = await User.findOne({email});
		if(!user){
			throw new ApiError(404, 'User not found');
		}
		await User.updatePassword(user.email, password);
		return res.status(200).send({message: 'Password updated successfully'});
	}else if(userRequest.purpose === 'SIGNUP'){
		const user = new User({
			email, password, role
		});	
		await user.save();
		return res.status(200).send({message: 'User successfully signed up'});
	}else{
		throw new ApiError(400, 'Invalid purpose');
	}
}

async function generateApiKey(_: Request, res: Response){
	const key = shortUUID.generate();

	await ApiKey.create({
		apiKey: key,
	});
	res.status(200).send({key});
}

export {
	login,
	signUp,
	forgotPassword,
	verifyOTP,
	generateApiKey,
}
