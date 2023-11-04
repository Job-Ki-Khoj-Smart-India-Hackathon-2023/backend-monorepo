import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

function deleteFile(publicId: string): Promise<UploadApiResponse|undefined>{
	return cloudinary.uploader.destroy(publicId);
};

function uploadBuffer(buffer: Buffer, folderName: string): Promise<UploadApiResponse|undefined>{
	const stream = Readable.from(buffer);
	return new Promise((resolve, reject) => {
		const writeStream = cloudinary.uploader.upload_stream(
			{ folder: folderName },
			(err, result)=>{
				if(err) return reject(err);
				resolve(result);
			}
		);
		stream.pipe(writeStream);
	});
}


export {
	uploadBuffer,
	deleteFile
}
