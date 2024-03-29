import { redisManager } from "../clients/redis-client";
import { isStringJsonParseable } from "./utils";

type GeoLocation = {
	lat: number,
	lng: number,
	range: number
}
enum JobType{
	PGRKAM_PRIVATE_JOB = 'pgrkam-private-job',
	JKK_JOB = 'jkk-job'
}

async function getNearbyJobs(geoLocation: GeoLocation) {
	const {lng, lat, range} = geoLocation;
	const jobPostsJSON = await redisManager.getContentJobPosts(
		await redisManager.getGeoJobPostIds(lat, lng, range)
	);
	const jobsPosts: {
		[JobType.PGRKAM_PRIVATE_JOB]: any[],
		[JobType.JKK_JOB]: any[]
	} = {
		[JobType.PGRKAM_PRIVATE_JOB]: [],
		[JobType.JKK_JOB]: [],
	};

	jobPostsJSON.forEach((jobPost) => {
		if(!jobPost || !isStringJsonParseable(jobPost)) {
			return;
		}
		const jobPostObj = JSON.parse(jobPost);
		if(jobPostObj?.metadata?.jobType !== JobType.PGRKAM_PRIVATE_JOB && jobPostObj?.metadata?.jobType !== JobType.JKK_JOB) {
			return;
		}
		
		jobsPosts[jobPostObj.metadata.jobType as JobType].push(jobPostObj);
	});

	return jobsPosts;
}


export {
	getNearbyJobs,
	JobType
};
