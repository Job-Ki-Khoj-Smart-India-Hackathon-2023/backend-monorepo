import { BEARER_TOKEN, URI, EMIT_LISTEN_INTERVAL_IN_MS, POLLING_PERCENTAGE, COORDINATE_EVENT, PGRKAM_PRIVATE_JOBS_EVENT, JKK_JOBS_EVENT, ERROR_EVENT, COORDINATE_OBJ} from "./constants";
import { UserMetric } from './types';
import { io } from "socket.io-client";

const runUser = async(tag: string, emitListenEvents: number): Promise<UserMetric> => {
  //console.log(`Starting user with ${emitListenEvents} emitListenEvents`);

  console.log(tag, 'started');
  const transports =
    Math.random() < POLLING_PERCENTAGE ? ["polling"] : ["polling", "websocket"];

  const socket = io(URI, {
    transports,
    autoConnect: true,
    extraHeaders: {
      Authorization: `Bearer ${BEARER_TOKEN}`
    }
  });

  const userMetric : UserMetric = {
    responseTimes: [],
    successCount: 0,
    errorCount: 0,
  }

  for(let emitListenEvent = 0; emitListenEvent < emitListenEvents; emitListenEvent++) {
    const start = performance.now();
    socket.emit(COORDINATE_EVENT, COORDINATE_OBJ);
    await new Promise(res=>{
      socket.on(PGRKAM_PRIVATE_JOBS_EVENT, (_:any) => {
	//console.log(data);
	userMetric.responseTimes.push(performance.now() - start);
	userMetric.successCount+=1;
	res(null);
      });
      socket.on(ERROR_EVENT, (_:any) => {
	userMetric.responseTimes.push(performance.now() - start);
	userMetric.errorCount+=1;
	res(null);
      });

      setTimeout(()=>{
	userMetric.errorCount+=1;
	res(null);
      }, 15_000); // after 15 seconds user will be said to be failed
    });
    await new Promise(res=>setTimeout(res, EMIT_LISTEN_INTERVAL_IN_MS));
  }
  socket.disconnect();

  console.log(tag, 'ended');
  return userMetric;
}


export {
  runUser
}
