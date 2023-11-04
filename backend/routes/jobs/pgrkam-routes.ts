import { Router } from "express";
import {
	getPrivateJob,
	getPrivateJobs,
	getPublicJob,
	getPublicJobs,
	getPrivateJobRecommendations
} from '../../controllers/jobs-controllers/pgrkam/pgrkam-controllers';
import validateResult from "../../middlewares/validate-result";
import { param, query } from "express-validator";
const router = Router();

function idValidator(){
	return param('id').isString().withMessage('Invalid id');
}
function pageInfoValidator(){
	return [
		query('page').isInt({min: 1}).withMessage('Invalid page number'),
		query('pageSize').isInt({min: 1, max:100}).withMessage('Invalid page size')
	];
}

router.get('/public', pageInfoValidator(), validateResult ,getPublicJobs);
router.get('/public/:id', idValidator(), validateResult, getPublicJob);


router.get('/private', pageInfoValidator(), validateResult, getPrivateJobs);
router.get('/private/recommendations', getPrivateJobRecommendations);
router.get('/private/:id', idValidator(), validateResult, getPrivateJob);

export default router;
