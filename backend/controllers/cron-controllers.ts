import { Request, Response } from 'express';
import { 
	IExp,
	IQualification,
	IStateAndDistrict,
	IDistrict,
	IJobType,
	IJobTitle,
} from './pgrkam/types';
import {
	getPrivateJobs,
	getPublicJobs,
	getExps,
	getQualifications,
	getStatesAndDistricts,
	getJobTypes,
	getJobTitles

} from './pgrkam/api';
import Experience from '../models/pgrkam-models/Experience';
import Qualification from '../models/pgrkam-models/Qualification';
import State from '../models/pgrkam-models/State';
import District from '../models/pgrkam-models/District';
import JobType from '../models/pgrkam-models/JobType';
import JobTitle from '../models/pgrkam-models/JobTitle';
import { savePGRKAMPrivateJobs, savePGRKAMPublicJobs } from './services/redis-mongo-service';
import { getCoordinatesFromText } from './maps/google-maps';

async function updateJobs(req: Request, res: Response){
	const { type } = req.query as { type: 'public' | 'private' };
	if(type === 'public'){
		const jobs = await getPublicJobs();
		savePGRKAMPublicJobs(jobs);
		res.status(200).json({ message: 'Done' });
		return;
	}

	const jobs = await getPrivateJobs();
	await savePGRKAMPrivateJobs(jobs);
		
	res.status(200).json({ message: 'Done' });
}


async function updateFilterValues(req: Request, res: Response){
	const { type } = req.query as { type: 'experience'|'qualification'|'state-district'|'job-type'|'job-title' }

	switch(type){
		case 'experience':
			const expData = await getExps();
			const expBulkWrite: any = [];
			expData.forEach((exp: IExp) => {
				expBulkWrite.push({
					updateOne: {
						filter: { id: exp.id },
						update: exp,
						upsert: true
					}
				});
			});
			await Experience.bulkWrite(expBulkWrite);
			break;	
		case 'qualification':
			const qualificationData = await getQualifications();
			const qualificationBulkWrite: any = [];
			qualificationData.forEach((qualification: IQualification) => {
				qualificationBulkWrite.push({
					updateOne: {
						filter: { id: qualification.id },
						update: qualification,
						upsert: true
					}
				});
			});
			await Qualification.bulkWrite(qualificationBulkWrite);
			break;
		case 'state-district':
			const stateDistrictData = await getStatesAndDistricts();
			
			const stateDistrictPromises = stateDistrictData.map(
				async (stateAndDistrict: IStateAndDistrict) => {
					const state = await State.findOneAndUpdate(
						{ stateId: stateAndDistrict.stateId },
						{ 
							$set: {
								stateId: stateAndDistrict.stateId,
								stateName: stateAndDistrict.stateName
							}
						},
						{ upsert: true, new: true }
					);

					const alreadySavedDistricts = await District.distinct('id',{ stateId: state._id }) as number[];
					const newDistricts = stateAndDistrict.dist.filter((district: IDistrict) => !alreadySavedDistricts.includes(district.id));
					if(newDistricts.length == 0){
						console.log(`No new districts found for ${state.stateName}`);
						return;
					}
					const newDistrictsWithLocation = await Promise.all(
						newDistricts.map(async (district: IDistrict) => {
							if(!district.description){
								return {
									...district,
									stateId: state._id,
								};
							}

							const coordinates = await getCoordinatesFromText(district.description);
							if(!coordinates){
								return {
									...district,
									stateId: state._id,
								};
							}
							const {lat, lng} = coordinates;

							return {
								...district,
								stateId: state._id,
								location: {
									type: 'Point',	
									coordinates: [lng, lat]
								}
							}
						})
					)
					await District.insertMany(newDistrictsWithLocation);
				}
			);
			await Promise.all(stateDistrictPromises);
			break;
		case 'job-type':
			const jobTypeData = await getJobTypes();
			const jobTypeBulkWrite: any = [];
			jobTypeData.forEach((jobType: IJobType) => {
				jobTypeBulkWrite.push({
					updateOne: {
						filter: { id: jobType.id },
						update: jobType,
						upsert: true
					}
				});
			});
			await JobType.bulkWrite(jobTypeBulkWrite);
			break;
		case 'job-title':
			const jobTitleData = await getJobTitles();
			const jobTitleBulkWrite: any = [];
			jobTitleData.forEach((jobTitle: IJobTitle) => {
				jobTitleBulkWrite.push({
					updateOne: {
						filter: { id: jobTitle.id },
						update: jobTitle,
						upsert: true
					}
				});
			});
			await JobTitle.bulkWrite(jobTitleBulkWrite);
			break;
	}
	res.status(200).send('Done');
}


export {
	updateJobs,
	updateFilterValues
}
