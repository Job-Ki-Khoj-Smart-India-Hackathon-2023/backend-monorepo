import {v2 as cloudinary} from 'cloudinary';


enum CloudinaryFolderNames{
	PROFILE_IMAGES = 'profile_images',
}

cloudinary.config({
	secure: true,
});

export {
	CloudinaryFolderNames
}

