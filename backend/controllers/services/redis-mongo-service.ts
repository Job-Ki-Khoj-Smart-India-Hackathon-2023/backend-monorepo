/**
 * This file contains logic for synchronizing data between database and cache
 * */

import {
	IPublicJob,
	IPrivateJob
} from '../pgrkam/types';
import PrivateJob from '../../models/pgrkam-models/PrivateJob';
import District from '../../models/pgrkam-models/District';
import { redisManager } from '../../clients/redis-client';
import PublicJob from '../../models/pgrkam-models/PublicJob';
import { JobType } from '../../server/job-recommender';
import mongoose from 'mongoose';



// fetch the location if provided of the respective jobs and then save the entire data into db, if location found then save the 
// documents for which location was found in to the redis as well
async function savePGRKAMPublicJobs(jobs: IPublicJob[]){
	// Since all of the public jobs are not having any location, we will be just inserting them in to the db
	// 1. Delete old jobs from the database
	//console.log('non descriptions =', JSON.stringify(jobs.filter(job=>typeof job.description !== 'string'), null, 2));
	//console.log(JSON.stringify(jobs, null, 2));
	const jobIds = jobs.map(job => job.id);
	await PublicJob.deleteMany({ id: { $nin: jobIds } }).exec();
	// 2. Insert new jobs in to the database
	const remainingJobs = await PublicJob.distinct('id') as number[];
	const newJobs = jobs.filter(job => !remainingJobs.includes(job.id));
	await PublicJob.insertMany(newJobs);
}


/**
 * TODO:
 * Remove redis geo id - we are going to be using _id object id for redis as well
 * remove redis-client from being used and use redis-manager instead - hence use redis-manager's safe apis for saving respective data
* */
async function savePGRKAMPrivateJobs(jobs: IPrivateJob[]){
	console.log('private jobs =', JSON.stringify(jobs.slice(0, 1), null, 2));
	{  // executed in block to clear memory as soon as possible
		// delete all the existing jobs whose id doesn't match with the new jobs
		const newJobIds = jobs.map(job => job.id);
		const outdatedJobs = (await PrivateJob.find({ id: { $nin: newJobIds } }, { id: 1, _id: 1}).exec()) as {  // 'metadata.redisGeoKey': 1 , 
			id: number, 
			_id: mongoose.Types.ObjectId, 
			//metadata: { redisGeoKey: string |null } 
		}[];
		const outdatedJobObjectIds = outdatedJobs.map(job => job._id.toString());
		console.log('outdated job object id\'s', outdatedJobObjectIds);
		await Promise.all([
			redisManager.delGeoJobPosts(outdatedJobObjectIds),
			redisManager.delContentJobPosts(outdatedJobObjectIds), 
			PrivateJob.deleteMany({ _id : { $in: outdatedJobObjectIds }})
		]);
	}
	
	// Fetch location of the new jobs
	let jaggedNewJobsWithLocation = [];
	{ // executed in block to free up memory space acquired by districts & remainingJobIds

		// find out the new jobs (that are not in the database) in the new jobs list
		const remainingJobIds  = await PrivateJob.distinct('id');
		const newJobs = jobs.filter(job => !remainingJobIds.includes(job.id));

		const districts = await District.find();
		jaggedNewJobsWithLocation = newJobs.map(job => { // fetching location for each job 
			if(job.location.length == 0){
				return {
					...job,
					metadata: {
						location : null,
						//redisGeoKey: null
					}
				};
			}
			const rawSpreadedJobWithLocation = job.location.map(location => {
				const coordinates = districts.find(districts => districts.id == location)?.location?.coordinates;
				if(!coordinates){
					return null;
				}

				const [lng, lat] = coordinates;
				//console.log(`found district for ${JSON.stringify(job, null,2)} with coordinates ${lng}, ${lat}`);
				return {
					...job,
					metadata: {
						location: {
							type: 'Point',
							coordinates: [lng, lat]
						},
						//redisGeoKey: shortUUID.generate() as string
					}
				};
			})

			const spreadedJobWithLocation = rawSpreadedJobWithLocation
				.filter(jobWithLocation => jobWithLocation != null) as  (IPrivateJob & 
				{	
					metadata: {
						location: { type: string, coordinates: [number,number] },
						//redisGeoKey: string
					}
				}
			)[];

			if(spreadedJobWithLocation.length == 0){
				return {
					...job,
					metadata: {
						location: null,
						//redisGeoKey: null
					}
				};
			}
			return spreadedJobWithLocation;
		});
	}
	//console.log('jaggedNewJobsWithLocation', jaggedNewJobsWithLocation);
	//console.log(`new jobs with location: ${JSON.stringify(jaggedNewJobsWithLocation, null, 2)}`);
	// 3. Save the new jobs in the db
	const newJobsWithLocation = jaggedNewJobsWithLocation.flat(1).map(jobWithLocation => {
		return new PrivateJob(jobWithLocation);
	});

	// 4. Save the new jobs in the redis for which location was found
	//const jobInsertionOperationsForRedis = newJobsWithLocation.filter(
	//	jobWithLocation => jobWithLocation.metadata?.location?.coordinates != null && jobWithLocation?.metadata?.redisGeoKey != null
	//)
	//.map((jobWithLocation)=> {
	//	return {
	//		...jobWithLocation,
	//		metadata: {
	//			...jobWithLocation.metadata,
	//			jobType: JobType.PGRKAM_PRIVATE_JOB
	//		}
	//	}
	//})
	//.map(async jobWithLocation => {
	//	if(jobWithLocation.metadata.location?.coordinates == null || jobWithLocation.metadata.redisGeoKey == null){
	//		return null;
	//	}
	//	const { metadata: { location: { coordinates: [lng, lat] }, redisGeoKey } } = jobWithLocation;
	//	await redisClient.geoAdd(RedisKeyManager.getGeoSpatialJobPostKey(), {longitude: lng, latitude: lat, member: redisGeoKey});	
	//	await redisClient.set(RedisKeyManager.getGeoSpatialJobPostContentKey(redisGeoKey), JSON.stringify(jobWithLocation));
	//});
	
	const contentJobPosts : {id:string, data: string}[] = [];
	const geoJobPosts : { member: string, longitude: number, latitude: number }[] = [];

	newJobsWithLocation.forEach(jobWithLocation => {
		const coordinates  = jobWithLocation.metadata?.location?.coordinates;
		if (!coordinates){
			return;
		}
		contentJobPosts.push({
			id: jobWithLocation._id.toString(),
			data: JSON.stringify({
				...jobWithLocation.toObject(),
				metadata: {
					...jobWithLocation.metadata,
					jobType: JobType.PGRKAM_PRIVATE_JOB
				}
			})
		});

		geoJobPosts.push({
			member: jobWithLocation._id.toString(),
			longitude: coordinates[0],
			latitude: coordinates[1],
		});
	});
	console.log('contentJobPosts', contentJobPosts);
	console.log('geoJobPosts', geoJobPosts);
	
	//await Promise.all([
	//	Promise.all(jobInsertionOperationsForRedis),
	//	//PrivateJob.bulkWrite(bulkOperation),
	//	PrivateJob.insertMany(newJobsWithLocation)
	//]);

	// Saving to redis and mongo
	await Promise.all([
		redisManager.addGeoJobPosts(geoJobPosts),
		redisManager.setContentJobPosts(contentJobPosts),
		PrivateJob.insertMany(newJobsWithLocation)
	]);
}

export {
	savePGRKAMPublicJobs,
	savePGRKAMPrivateJobs
}
