import { body, param } from 'express-validator';
import { Router } from 'express';
import { login, signUp, forgotPassword, generateApiKey, verifyOTP} from '../../controllers/user-controllers';
import validateResult from '../../middlewares/validate-result';
import adminMiddleware from '../../middlewares/admin-middleware';
import profileRoutes from './profile-routes';
import authMiddleware from '../../middlewares/auth-middleware';

const router = Router();

router.use('/profile', authMiddleware, profileRoutes);

router.post(
	'/login', 
	[
		body('email').isEmail().withMessage('Invalid email'),
		body('password').exists().isString().withMessage('Invalid password')
	],
	validateResult,
	login
);

router.post(
	'/signup',
	[
		body('email').isEmail().withMessage('Invalid email'),
		body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
		body('role').isIn(['jobseeker', 'employer']).withMessage('Invalid role')
	],
	validateResult,
	signUp
);

router.post(
	'/forgot-password',
	[
		body('email').isEmail().withMessage('Invalid email'),
		body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long')
	],
	validateResult,
	forgotPassword
);

router.post(
	'/verify-otp/:otp',
	param('otp')
		.isString()
		.matches(/[0-9]{6}/)
		.withMessage('Invalid otp'),
	validateResult,
	verifyOTP
);

router.get(
	'/api-key',
	adminMiddleware,
	generateApiKey
)






export default router;
