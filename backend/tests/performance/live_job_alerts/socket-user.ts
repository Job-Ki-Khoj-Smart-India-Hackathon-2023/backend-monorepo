import { parentPort } from "worker_threads";
import { runUser } from "./common";


parentPort!.on('message', async ({tag, emitListenEvents}:{tag: string, emitListenEvents: number}) => {
  const userMetric = await runUser(tag, emitListenEvents);
  parentPort!.postMessage(userMetric);
});
