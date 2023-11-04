import { Router } from 'express';
import { 
	getProfile,
	addProfile,
	editPersonalInfo,
	editContactInfo
} from '../../controllers/profile-controllers/employer-profile-controllers';
import validateResult from '../../middlewares/validate-result';
import { validateMandatoryContactInfo, validateMandatoryPersonalInfo } from '../utils/validation-chains';
import { upload } from '../../helpers/multer-config';
import { editProfilePic } from '../../controllers/profile-controllers/employer-profile-controllers';
import { profilePicMiddleware } from '../../middlewares/profile-pic-middleware';


const router = Router();

router.get('/', getProfile);

router.post('/', 
	validateMandatoryPersonalInfo(),
	validateMandatoryContactInfo(),
	validateResult,
	addProfile
);

// personal info routes
router.put('/personal-info', validateMandatoryPersonalInfo(), validateResult, editPersonalInfo);

// contact info routes
router.put('/contact-info', validateMandatoryContactInfo(), validateResult, editContactInfo);

// update profile pic
router.put('/profile-pic', upload.single('pic'), profilePicMiddleware, editProfilePic);

export default router;
