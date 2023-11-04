import { Router } from 'express';
import { query } from 'express-validator';
import {updateJobs, updateFilterValues} from '../controllers/cron-controllers';
import validateResult from '../middlewares/validate-result';
import apiKeyMiddleware from '../middlewares/api-key-middleware';

const router = Router();

router.use(apiKeyMiddleware);

router.get(
	'/update-jobs', 
	query('type').isIn(['private','public']),
	validateResult,
	updateJobs
);
router.get(
	'/update-filter-values',
	query('type').isIn(['experience','qualification','state-district','job-type','job-title']),
	validateResult,
	updateFilterValues
);


export default router;
