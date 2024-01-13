import { z } from 'zod';
import { isStringJsonParseable } from '../../utils';
import UserSocket from "../../../helpers/models/user-socket";

function handleCoordinatesEvent(socket: UserSocket, data: any){
	console.log("Coordinates received", data);
	if(typeof data == 'string' && !isStringJsonParseable(data)){
		socket.emit('error', 'Invalid JSON format');
		return;
	}
	const parsedData : {lat: number, lng: number, range: number }= typeof data == 'string' ? JSON.parse(data) : data;
	console.log(parsedData);
	try{
		z.object({lat: z.number(), lng: z.number(), range: z.number()}).parse(parsedData);
		socket.emit('nearby-jobseekers', "Not implemented yet!");
	}catch(err){
		if(err instanceof z.ZodError){
			socket.emit('error', err.issues);
		}else{
			socket.emit('error', err);		
		}
	}
}


export default handleCoordinatesEvent;
