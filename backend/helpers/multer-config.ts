import multer from 'multer';


const FILE_SIZE = 10 * 1024 * 1024; // 1MB
const storage = multer.memoryStorage();
const upload = multer({
	storage,
	limits: {
		fileSize: FILE_SIZE
	}
});


export{
	storage,
	upload,
	FILE_SIZE
}
