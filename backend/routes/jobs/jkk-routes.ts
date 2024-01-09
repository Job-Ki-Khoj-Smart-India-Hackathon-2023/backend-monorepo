
/** Middlewares to check whether the user is a jobseeker or an employer are to be added here
 * as different verbs are used for different types of users.
 * */

import { Router } from "express";
import { 
	submit, 
	revoke,  
	getApplications,
	getApplicationDetails,
} from "../../controllers/jobs-controllers/jkk/application-controllers";
import { open, updateStatus, getJobs, getJobDetails} from "../../controllers/jobs-controllers/jkk/jkk-controllers";
import jobseekerMiddleware from "../../middlewares/jobseeker-middleware";
import employerMiddleware from "../../middlewares/employer-middleware";
import { pageInfoValidator, validateOpenJKKJobPost } from "../utils/validation-chains";
import validateResult from "../../middlewares/validate-result";
import { body, param, query} from "express-validator";

const router = Router();

/**
 * TODO 
 * add json validation for each route
 */

/**JKK Job routes*/
router.post(
	'/',
	employerMiddleware,
	validateOpenJKKJobPost(),
	validateResult,
	open
);
router.patch(
	'/:jkkJobPostId', 
	employerMiddleware,
	[
		param('jkkJobPostId').isMongoId().withMessage('Invalid job post id'),
		query('status')
			.isString().withMessage('status must be a string')
			.notEmpty().withMessage('status must be a valid string')
			.isIn(['under-review', 'interviewing', 'closed']).withMessage('Invalid status')
	],
	validateResult,
	updateStatus
);
router.get(
	'/',
	pageInfoValidator,
	getJobs
);
router.get( 
	'/:jkkJobPostId',
	[
		param('jkkJobPostId').isMongoId().withMessage('Invalid job post id')
	],
	validateResult,
	getJobDetails
);


/**Application routes*/
router.post(
	'/:jkkJobPostId/applications',
	jobseekerMiddleware,
	submit
);
router.delete(
	'/:jkkJobPostId/applications/:applicationId',
	jobseekerMiddleware,
	revoke
);
router.get( // for employers to see particular application
	'/:jkkJobPostId/applications',
	employerMiddleware,
	getApplications,
);
router.get( // for employers to see particular application
	'/:jkkJobPostId/applications/:applicationId',
	employerMiddleware,
	getApplicationDetails,
);

export default router;
