import * as grpc from '@grpc/grpc-js';
import { JobServiceClient } from '../generated/job_service';


console.log(process.env.ML_SERVICE_URI!);
const client = new JobServiceClient(process.env.ML_SERVICE_URI!, grpc.credentials.createInsecure());

client.getChannel().watchConnectivityState(
	client.getChannel().getConnectivityState(true), 
	Date.now() + 2e3, 
	(err) => {
		console.log('grpc state',err);
	}
);

export default client;
