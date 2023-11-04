import { describe, expect, test, it} from '@jest/globals';
import { log } from 'console';
import {
	getPublicJobs,
	getPrivateJobs,
	getExps,
	getQualifications,
	getJobTypes,
	getJobTitles,
	getStatesAndDistricts
} from '../../controllers/pgrkam/api';
import { IStateAndDistrict } from '../../controllers/pgrkam/types';



describe('pgrkam api', ()=>{
		
	test('private job api', async ()=>{
		const data = await getPrivateJobs()
		//log(`Private Job: ${JSON.stringify(data.slice(0,1),null,2)}`);
		expect(data.length).toBeGreaterThan(0);
	}, 10_000);

	test('public job api', async ()=>{
		const data = await getPublicJobs()
		//log(`public Job: ${JSON.stringify(data.slice(0,1),null,2)}`);
		expect(data.length).toBeGreaterThan(0);
	}, 10_000);

	test('exps api', async ()=>{
		const data = await getExps()
		//log(`exps: ${JSON.stringify(data.slice(0,1),null,2)}`);
		expect(data.length).toBeGreaterThan(0);
	}, 10_000);

	test('qualifications api', async ()=>{
		const data = await getQualifications()
		//log(`exps: ${JSON.stringify(data.slice(0,1),null,2)}`);
		expect(data.length).toBeGreaterThan(0);
	}, 10_000);

	test('jobTypes api', async ()=>{
		const data = await getJobTypes()
		//log(`jobTypes: ${JSON.stringify(data.slice(0,1),null,2)}`);
		expect(data.length).toBeGreaterThan(0);
	}, 10_000);

	test('jobTitles api', async ()=>{
		const data = await getJobTitles()
		//log(`jobTitles: ${JSON.stringify(data.slice(0,1),null,2)}`);
		expect(data.length).toBeGreaterThan(0);
	}, 10_000);

	test('states and districts api', async ()=>{
		const data = await getStatesAndDistricts();
		//log(`states and districts: ${JSON.stringify(data.slice(0,1),null,2)}`);
		expect(data.length).toBeGreaterThan(0);
		expect(data.find((d:IStateAndDistrict)=>d.stateName==='All Over India')).toBeTruthy();
	}, 10_000);
});


