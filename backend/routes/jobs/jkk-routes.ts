
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
import { 
	open,
	updateStatus,
	getOpenJobs,
	getJobDetails,
	getEmployerJobs
} from "../../controllers/jobs-controllers/jkk/jkk-controllers";
import jobseekerMiddleware from "../../middlewares/jobseeker-middleware";
import employerMiddleware from "../../middlewares/employer-middleware";
import { pageInfoValidator, validateOpenJKKJobPost } from "../utils/validation-chains";
import validateResult from "../../middlewares/validate-result";
import { body, param, query} from "express-validator";

const router = Router();

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
	[
		query('page').default(0).isInt({min:0}),
		query('pageSize').default(10).isInt({min:1, max:50}),
		query('sort').default('dsc').isIn(['dsc', 'asc'])
	],
	validateResult,
	getOpenJobs
);

router.get(
	'/mine',
	[
		query('page').default(0).isInt({min:0}),
		query('pageSize').default(10).isInt({min:1, max:50}),
		query('sort').default('dsc').isIn(['dsc', 'asc'])
	],
	validateResult,
	employerMiddleware,
	getEmployerJobs
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
	[
		param('jkkJobPostId').isMongoId().withMessage('Invalid Job Post id'),
	],
	validateResult,
	jobseekerMiddleware,
	submit
);

router.delete(
	'/:jkkJobPostId/applications',
	[
		param('jkkJobPostId').isMongoId().withMessage('Invalid Job Post id'),
	],
	validateResult,
	jobseekerMiddleware,
	revoke
);

router.get( // for employers to see applications under the employers job post
	'/:jkkJobPostId/applications',
	[
		param('jkkJobPostId').isMongoId().withMessage('Invalid Job Post id'),
		query('page').default(0).isInt({min:0}),
		query('pageSize').default(10).isInt({min:1, max:50}),
		query('sort').default('dsc').isIn(['dsc', 'asc'])
	],
	validateResult,
	employerMiddleware,
	getApplications,
);

router.get( // for employers to see particular application
	'/:jkkJobPostId/applications/:applicationId',
	[
		param('jkkJobPostId').isMongoId().withMessage('Invalid Job Post id'),
		param('applicationId').isMongoId().withMessage('Invalid Application id'),
	],
	validateResult,
	employerMiddleware,
	getApplicationDetails,
);

export default router;
