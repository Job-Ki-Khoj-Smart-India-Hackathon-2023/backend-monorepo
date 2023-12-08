import { Router } from "express";
import {
	getPrivateJob,
	getPrivateJobs,
	getPublicJob,
	getPublicJobs,
	getPrivateJobRecommendations,
	getPublicJobRecommendations
} from '../../controllers/jobs-controllers/pgrkam/pgrkam-controllers';
import validateResult from "../../middlewares/validate-result";
import {
	idValidator,
	pageInfoValidator
} from '../utils/validation-chains';

const router = Router();

router.get('/public', pageInfoValidator(), validateResult ,getPublicJobs);
// IMP: have this before public/:id otherwise it will be treated as public/:id
router.get('/public/recommendations', getPublicJobRecommendations);
router.get('/public/:id', idValidator(), validateResult, getPublicJob);


router.get('/private', pageInfoValidator(), validateResult, getPrivateJobs);
// IMP: have this before private/:id otherwise it will be treated as private/:id
router.get('/private/recommendations', getPrivateJobRecommendations);
router.get('/private/:id', idValidator(), validateResult, getPrivateJob);

export default router;
