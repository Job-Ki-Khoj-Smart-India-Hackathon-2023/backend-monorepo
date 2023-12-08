
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
import { pageInfoValidator } from "../utils/validation-chains";

const router = Router();

/**
 * TODO 
 * add json validation for each route
 */

/**JKK Job routes*/
router.post(
	'/',
	employerMiddleware,
	open
);
router.patch(
	'/', 
	employerMiddleware,
	updateStatus
);
router.get(
	'/',
	pageInfoValidator,
	getJobs
);
router.get(
	'/:jkkJobPostId',
	pageInfoValidator,
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
