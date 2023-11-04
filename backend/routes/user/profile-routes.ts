import { Router } from 'express';
import jobseekerProfileRoutes from './jobseeker-profile-routes';
import jobseekerMiddleware from '../../middlewares/jobseeker-middleware';
import employerMiddleware from '../../middlewares/employer-middleware';
import employerProfileRoutes from './employer-profile-routes';


const router = Router();

router.use('/jobseeker', jobseekerMiddleware, jobseekerProfileRoutes);
router.use('/employer', employerMiddleware, employerProfileRoutes);

export default router;
