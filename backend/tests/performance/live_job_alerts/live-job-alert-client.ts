import percentile from 'percentile';
import { UserMetric, Metric, Phase } from './types';
import { PHASES } from "./constants";
import { runUser } from './common';




const runPhase = async(phase: Phase): Promise<UserMetric[]> => {
  console.log(`Running phase ${phase.name} with ${phase.users} users`);
  let phaseMetrics: UserMetric[] = [];
  const promises: Promise<UserMetric>[] = [];
  for(let user = 0; user < phase.users; user++) { 
    const tag = `${phase.name}:user${user+1}`;

    // semaphore defeats the purpose of load testing
    //const [_, release] = await semaphore.acquire()
    //const worker = new Worker('./socket-user.ts');
    //worker.postMessage({tag, emitListenEvents: phase.emitListenEvents});
    //promises.push(new Promise((res, _)=>{
    //  worker.on('message', (userMetric: UserMetric)=>{
    //    release();
    //    res(userMetric);
    //    worker.terminate();
    //  });
    //}));

    // invoke and run user
    promises.push(runUser(tag, phase.emitListenEvents)); 
//    promises.push(
//	job(async({tag, emitListenEvents}:{tag: string, emitListenEvents:number})=>{
//	  const userMetric = await runUser(tag, emitListenEvents);
//	  return userMetric;
//	}, {data: {tag, emitListenEvents: phase.emitListenEvents}}).then((userMetric: UserMetric)=> res(userMetric))
//    );
  }
  phaseMetrics = await Promise.all(promises);
  console.log(`Phase ${phase.name} completed with ${phase.users} users`);
  return phaseMetrics;
}



const run = async(): Promise<Metric[]> => {
  console.log("Running test");
  const metrics : Metric[] = [];
  for(const phase of PHASES){

    // executing phase
    const phaseMetrics = await runPhase(phase);
    //console.log(phaseMetrics);

    // aggregating phase metrics
    const responseTimes = [];
    let successCount = 0;
    let errorCount = 0;

    for(const phaseMetric of phaseMetrics){
      responseTimes.push(phaseMetric.responseTimes.reduce((acc,cur)=>acc+cur, 0)/phaseMetric.responseTimes.length);
      successCount += phaseMetric.successCount;
      errorCount += phaseMetric.errorCount;
    }

    const [p90, p95, p99] = percentile([90,95,99], responseTimes) as [number,number,number];

    metrics.push({
      name: phase.name,
      users: phase.users,
      p90,
      p95,
      p99,
      successRate: (successCount/(successCount+errorCount))*100,
      errorRate: (errorCount/(successCount+errorCount))*100,
    });
  } 
  console.log("Test ended")

  return metrics;
}


async function main(){
  const metrics = await run();
  console.log(metrics);
}

main();
