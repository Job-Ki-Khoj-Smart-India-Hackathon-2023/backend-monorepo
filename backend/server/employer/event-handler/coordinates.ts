import { z } from 'zod';
import { isStringJsonParseable } from '../../utils';
import UserSocket from "../../../helpers/models/user-socket";
import { redisManager } from '../../../clients/redis-client';

async function handleCoordinatesEvent(socket: UserSocket, data: any){
	console.log("Coordinates received", data);
	if(typeof data == 'string' && !isStringJsonParseable(data)){
		socket.emit('error', 'Invalid JSON format');
		return;
	}
	const parsedData : {lat: number, lng: number, range: number }= typeof data == 'string' ? JSON.parse(data) : data;
	console.log(parsedData);
	try{
		z.object({lat: z.number(), lng: z.number(), range: z.number()}).parse(parsedData);

		const nearbyJobseekerIds = await redisManager.getGeoJobseeker(parsedData.lat, parsedData.lng, parsedData.range);
		const nearbyJobseekerInfo = await redisManager.getJobseekersInfoForNearbyEmployers(nearbyJobseekerIds);

		socket.emit('nearby-jobseekers', nearbyJobseekerInfo);
	}catch(err){
		if(err instanceof z.ZodError){
			socket.emit('error', err.issues);
		}else{
			socket.emit('error', err);		
		}
	}
}


export default handleCoordinatesEvent;
