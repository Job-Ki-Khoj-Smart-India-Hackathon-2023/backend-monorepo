import { Router } from "express";
import { 
	validateMandatoryExperienceInfo, 
	validateMandatoryEducationInfo, 
	validateMandatoryContactInfo, 
	validateMandatoryPersonalInfo,
    validateSingleExperienceInfo,
    validateSingleEducationInfo,
} from "../utils/validation-chains";
import { param, body, query, check } from "express-validator";
import validateResult from "../../middlewares/validate-result";
import {profilePicMiddleware, optionalProfilePicMiddleware} from "../../middlewares/profile-pic-middleware";
import { 
	getProfile, 
	addProfile, 
	addExperience, 
	deleteExperience, 
	editExperience, 
	addEducation, 
	deleteEducation, 
	editEducation,
	clearExperience,
	clearEducation,
	editSkills,
	editPersonalInfo,
	editContactInfo,
    editProfilePic
} from "../../controllers/profile-controllers/jobseeker-profile-controllers";
import { upload } from '../../helpers/multer-config';

const router = Router();

router.get('/', getProfile);

router.post(
	'/',
	validateMandatoryPersonalInfo(),
	validateMandatoryContactInfo(),
	validateMandatoryEducationInfo(),
	validateMandatoryExperienceInfo(),
	body('skills').isArray().withMessage('Skills must be an array')
		.custom((skills:any[])=>{
			for(let skill of skills){
				if(typeof skill!=='string'){
					throw new Error("Skills must be an array of strings");
				}
			}
			return true;
		}),
	validateResult,
	addProfile
);

// edit profile picture
router.put(
	'/profile-pic',
	upload.single('pic'),
	profilePicMiddleware,
	editProfilePic
);

// personal info routes
router.put('/personal-info', validateMandatoryPersonalInfo(), validateResult, editPersonalInfo);

// contact info routes
router.put('/contact-info', validateMandatoryContactInfo(), validateResult, editContactInfo);

// experience routes
router.delete(
	'/experience/:id',
	param('id').isMongoId().withMessage('Invalid experience id'),
	validateResult,
	deleteExperience
);

router.post(
	'/experience',
	validateSingleExperienceInfo(),
	validateResult,
	addExperience,
);

router.put(
	'/experience/:id',
	param('id').isMongoId().withMessage('Invalid experience id'),
	validateSingleExperienceInfo(),
	validateResult,
	editExperience,
);

router.delete(
	'/experience',
	clearExperience,
);

// education routes
router.post(
	'/education',
	validateSingleEducationInfo(),
	validateResult,
	addEducation,
);

router.delete(
	'/education/:id',
	param('id').isMongoId().withMessage('Invalid education id'),
	validateResult,
	deleteEducation
);

router.put(
	'/education/:id',
	param('id').isMongoId().withMessage('Invalid education id'),
	validateSingleEducationInfo(),
	validateResult,
	editEducation,
);

router.delete(
	'/education',
	clearEducation,
);


// skill routes
router.put(
	'/skills',
	body('skills').isArray().withMessage('Skill must be an array')
		.custom((skills: any[])=>{
			for(let skill of skills){
				if(typeof skill!=='string'){
					throw new Error("Skills must be an array of strings");
				}
			}
			return true;
		}),
	validateResult,
	editSkills,
);

export default router;
