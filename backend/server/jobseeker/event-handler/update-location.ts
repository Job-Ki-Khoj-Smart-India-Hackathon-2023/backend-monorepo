import { z } from "zod";
import UserSocket from "../../../helpers/models/user-socket";
import { isStringJsonParseable } from "../../utils";
import { redisManager } from "../../../clients/redis-client";

async function handleUpdateLocationEvent(socket: UserSocket, data: any){
	console.log("location received");
	if(typeof data == 'string' && !isStringJsonParseable(data)){
		socket.emit('error', 'Invalid JSON format');
		return;
	}
	let parsedData = typeof data == 'string' ? JSON.parse(data) : data;
	console.log(parsedData);
	try{
		z.object({lat: z.number(), lng: z.number()}).parse(parsedData);
		const { lat, lng } = parsedData as {lat:number, lng: number};
		await redisManager.addGeoJobseeker({
			member: socket.user!._id.toString(),
			latitude: lat,
			longitude: lng
		});
	}catch(err){
		console.log(`error = ${err}`);
		if(err instanceof z.ZodError){
			socket.emit('error', err.issues);
		}else{
			socket.emit('error', err);		
		}
	}
}


export default handleUpdateLocationEvent;
