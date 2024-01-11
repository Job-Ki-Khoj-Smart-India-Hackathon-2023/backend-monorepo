import {query, body, param } from "express-validator";


function validateJobInfo() {
	return [
		body('jobInfo').isObject().withMessage('Missing job info'),
		body('jobInfo.title').isString().withMessage('Job title should be of string type'),
		body('jobInfo.description').isString().withMessage('Description should be of string type'),
		body('jobInfo.genderPreference')
			.optional()
			.isString()
			.isIn(['Male', 'Female', 'Other'])
			.withMessage('Invalid gender preference'),
		body('jobInfo.education').optional().isString().withMessage('Education should be of string type'),
		body('jobInfo.vacancies')
			.isInt({ min: 1 })
			.withMessage('Vacancies must be an integer greater than 0'),
		body('jobInfo.salary').isObject().withMessage('salary should be an object'),
		body('jobInfo.salary.min')
			.optional()
			.isInt({ min: 1 })
			.withMessage('Minimum salary must be an integer greater than 0'),
		body('jobInfo.salary.max')
			.optional()
			.isInt({ min: 1 })
			.withMessage('Maximum salary must be an integer greater than 0'),
		body('jobInfo.responsibilities')
			.isArray({ min: 1 })
			.withMessage('Responsibilities should be a non-empty array of strings'),
		body('jobInfo.requiredSkills')
			.isArray({ min: 1 })
			.withMessage('Required skills should be a non-empty array of strings'),
	];
}


function validateOpenJKKJobPost(){
	return [
		body('companyName').isString().isLength({max: 20}).withMessage('Company name should be a string'),
		body('location').isObject().withMessage('Missing location'),
		body('location.lat').isFloat().withMessage('Latitude(lat) should be a float value'),
		body('location.lng').isFloat().withMessage('Longitude(lng) should be a float value'),
		...validateJobInfo(),
		body('tags')
		.isArray()
		.withMessage('tags must be a list of strings')
		.custom((tags)=>{
			if(!tags.every((tag:any)=>typeof tag === 'string')){
				throw new Error("All tags must be string");
			}
			return true;
		})
	];
}

function validateMandatoryPersonalInfo(){
	return [
		body('personalInfo').isObject().withMessage('Personal info must be an object'),
		body('personalInfo.firstName').isString().withMessage('First name must be a string'),
		body('personalInfo.lastName').isString().withMessage('Last name must be a string'),
		body('personalInfo.dob').isISO8601().withMessage('Invalid ISO8601 date of birth').custom((dob: string)=> {if(new Date(dob) < new Date()) return true; else throw new Error('You will born after today?')}),
		body('personalInfo.nationality').isIn(['Indian', 'Other']),
		body('personalInfo.gender').isIn(['Male','Female','Other']),
	];
}

function validateMandatoryContactInfo(){
	return [
		body('contactInfo').isObject().withMessage('Contact info must be an object'),
		body('contactInfo.address').isString().withMessage('Address must be a string'),
		body('contactInfo.phoneNo').isString().isLength({min:10, max:10}).withMessage('Phone number must be a string with 10 digits').optional(),
		body('contactInfo.socialMediaProfiles').isArray().withMessage('Social media profiles must be an array')
		.custom((socialMediaProfiles: any[]) => {
			for(let socialMediaProfile of socialMediaProfiles) {
				new URL(socialMediaProfile);
			}
			return true;
		}),
	];
}

function validateMandatoryExperienceInfo(){
	return [
		body('experience').isArray().withMessage('Experience must be an array'),
		body('experience.*.jobTitle').isString().withMessage('Job title must be a string'),
		body('experience.*.description').isString().withMessage('description must be a string'),
		body('experience.*.company').isString().withMessage('Company must be a string'),
		body('experience.*.location').isString().withMessage('Location must be a string'),
		body('experience.*.startDate').isISO8601().withMessage('Start date must be a valid ISO8601 date'),
		body('experience.*.endDate').isISO8601().withMessage('Start date must be a valid ISO8601 date').optional(),
	];
}

function validateMandatoryEducationInfo(){
	return [
		body('education').isArray().withMessage('Education must be an array'),
		body('education.*.degree').isString().withMessage('Degree must be a string'),
		body('education.*.score').isNumeric().withMessage('Score must be a number')
			.custom((score:number)=>{
				if(score>=0&&score<=100){
					return true;
				}
				throw new Error("Score must be between 0 and 100");
			}),
		body('education.*.scoredOutOf').isNumeric().withMessage('Score must be a number')
			.custom((score:number)=>{
				if(score>=0&&score<=100){
					return true;
				}
				throw new Error("Score must be between 0 and 100");
			}),
		body('education.*.institute').isString().withMessage('Institute must be a string'),
		body('education.*.location').isString().withMessage('Institute location must be a string'),
		body('education.*.startDate').isISO8601().withMessage('Start date valid ISO8601 date'),
		body('education.*.endDate').isISO8601().withMessage('Start date valid ISO8601 date').optional(),
	];
}

function validateSingleEducationInfo(){
	return [
		body('education').isObject().withMessage('Education must be an object'),
		body('education.degree').isString().withMessage('Degree must be a string'),
		body('education.score').isNumeric().withMessage('Score must be a number')
			.custom((score:number)=>{
				if(score>=0&&score<=100){
					return true;
				}
				throw new Error("Score must be between 0 and 100");
			}),
		body('education.scoredOutOf').isNumeric().withMessage('Score must be a number')
			.custom((score:number)=>{
				if(score>=0&&score<=100){
					return true;
				}
				throw new Error("Score must be between 0 and 100");
			}),
		body('education.institute').isString().withMessage('Institute must be a string'),
		body('education.location').isString().withMessage('Institute location must be a string'),
		body('education.startDate').isISO8601().withMessage('Start date valid ISO8601 date'),
		body('education.endDate').isISO8601().withMessage('Start date valid ISO8601 date').optional(),
	];
}

function validateSingleExperienceInfo(){
	return [
		body('experience').isObject().withMessage('Experience must be an object'),
		body('experience.jobTitle').isString().withMessage('Job title must be a string'),
		body('experience.description').isString().withMessage('description must be a string'),
		body('experience.company').isString().withMessage('Company must be a string'),
		body('experience.location').isString().withMessage('Location must be a string'),
		body('experience.startDate').isISO8601().withMessage('Start date must be a valid ISO8601 date'),
		body('experience.endDate').isISO8601().withMessage('Start date must be a valid ISO8601 date').optional(),
	];
}

function idValidator(){
	return param('id').isString().withMessage('Invalid id');
}
function pageInfoValidator(){
	return [
		query('page').isInt({min: 1}).withMessage('Invalid page number'),
		query('pageSize').isInt({min: 1, max:100}).withMessage('Invalid page size')
	];
}

export {
	validateMandatoryPersonalInfo,
	validateMandatoryContactInfo,
	validateMandatoryExperienceInfo,
	validateMandatoryEducationInfo,
	validateSingleEducationInfo,
	validateSingleExperienceInfo,
	idValidator,
	pageInfoValidator,
	validateJobInfo,
	validateOpenJKKJobPost
}
