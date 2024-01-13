import { z } from 'zod';
import { isStringJsonParseable } from '../../utils';
import { getNearbyJobs, JobType } from '../../job-recommender';
import UserSocket from '../../../helpers/models/user-socket';

function handleCoordinatesEvent(socket: UserSocket, data: any){
	console.log("Coordinates received", data);
	if(typeof data == 'string' && !isStringJsonParseable(data)){
		socket.emit('error', 'Invalid JSON format');
		return;
	}
	const parsedData = typeof data == 'string' ? JSON.parse(data) : data;
	console.log(parsedData);
	try{
		z.object({lat: z.number(), lng: z.number(), range: z.number()}).parse(parsedData);
		// Get job posts relevant to the user
		getNearbyJobs(parsedData)
			.then((jobs)=>{
				socket.emit(`${JobType.JKK_JOB}s`, jobs[JobType.JKK_JOB]);
				socket.emit(`${JobType.PGRKAM_PRIVATE_JOB}s`, jobs[JobType.PGRKAM_PRIVATE_JOB]);
			})
			.catch((err)=>{
				socket.emit('error', err);
		})
	}catch(err){
		if(err instanceof z.ZodError){
			socket.emit('error', err.issues);
		}else{
			socket.emit('error', err);		
		}
	}
}


export default handleCoordinatesEvent;
