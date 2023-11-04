import axios , {AxiosError} from 'axios';
import axiosRetry from 'axios-retry';
import { isUrlValid, convertStringToDate } from './utils';
import { IPublicJob, IPrivateJob, IExp, IQualification, IStateAndDistrict, IJobType, IJobTitle } from './types';
import dotenv from 'dotenv';
dotenv.config();

const {PGRKAM_BASE_URL} = process.env;

if(!PGRKAM_BASE_URL){
	throw new Error('PGRKAM_BASE_URL must be defined');
}


const PGRKAMAxios = axios.create({
	baseURL: PGRKAM_BASE_URL,
});

axiosRetry(PGRKAMAxios, { 
	retries: 3 ,
	retryDelay: axiosRetry.exponentialDelay,
});

const PUBLIC_JOB_PATH = '/govt-job/index';
const PRIVATE_JOB_PATH = '/post-jobs/index';
const EXP_PATH = '/exp/index';
const QUALIFICATION_PATH = '/education_level/index';
const STATE_DISTRICT_PATH = '/state/index';
const JOB_TYPE_PATH = '/ggr-organization-type/view';
const JOB_TITLE_PATH = '/jobs-description/view';


async function getPublicJobs(): Promise<IPublicJob[]>{
	try{
		const { data } = await PGRKAMAxios.get(PUBLIC_JOB_PATH);

		if(!Array.isArray(data)){
			console.log(`Expected array, got ${JSON.stringify(data)}`);
			return [];
		}

		return data.map((job: any) => {
			return {
				id: Number(job.id),
				companyName: job.company_name,
				govt: job.govt,
				jobTitle: job.job_title,
				location: job.location,
				description: job.description,
				displayQualification: job.display_qualification,
				searchQualification: job.search_qualification,
				educationLevel: Number(job.education_level),
				educationLevel2: Number(job.education_level2),
				searchQualification2: job.search_qualification2,
				designation: job.designation,
				minMark: job.minmark,
				districtId: job.district_id ? Number(job.district_id) : null,
				experience: job.experience && job.experience !== 'nil'?job.experience : null,
				specialization: job.specialization,
				minExperience: job.min_exp ? Number(job.min_exp) : null,
				maxExperience: job.max_exp ? Number(job.max_exp) : null,
				salary: job.salary ? Number(job.salary) : null,
				genderPreference: job.gender_preference,
				genderSearch: job.gender_search ? job.gender_search : null,
				minAgeSearch: job.min_age_search ? job.min_age_search : null,
				minAge: Number(job.min_age),
				maxAge: Number(job.max_age),
				vacancy: Number(job.vacancy),	
				lastDate: convertStringToDate(job.last_date),
				walkInInterview: job.walk_in_interview ? new Date(job.walk_in_interview) : null,
				postedOn: new Date(job.posted_on),
				pdfLink: isUrlValid(job.pdf_link)?job.pdf_link: null,
				applyLink: isUrlValid(job.apply_link)?job.apply_link: null,
				applyMode: job.apply_mode,
				remarks: job.remarks,
				dbeesRemarks: job.dbees_remarks,
				dbeeReply: job.dbee_reply,
				createdAt: convertStringToDate(job.created_at),
				updatedAt: new Date(job.updated_at),
				postedBy: job.postedBy,
				postedDbee: Number(job.posted_dbee),
			}
		});
	}catch(e){
		if(e instanceof AxiosError){
			console.log(e.response?.data);
		}else{
			console.log(e);
		}
	}
	return [];
}

async function getPrivateJobs(): Promise<IPrivateJob[]>{
	try{
		const { data } = await PGRKAMAxios.get(PRIVATE_JOB_PATH);

		if(!Array.isArray(data)){
			return [];
		}

		return data.map((job: any) => {
			return {
				id: Number(job.id),
				orgId: Number(job.org_id),
				orgName: job.org_name,
				jobTitle: job.job_title,
				designation: job.designation,
				salaryType: job.salary_type,
				description: job.description,
				minExperience: job.min_exp ? Number(job.min_exp) : null,
				maxExperience: job.max_exp ? Number(job.max_exp): null,
				relMinExp: job.rel_min_exp ? Number(job.rel_min_exp) : null,
				relMaxExp: job.rel_max_exp ? Number(job.rel_max_exp) : null ,
				location: job.location.map((lc : string)=>Number(lc)),
				stateId: (JSON.parse(job.state_id)).map((id: string) => Number(id)),
				natureOfJob: job.nature_of_job ? Number(job.nature_of_job) : null,
				salaryMin: Number(job.salary_min),
				salaryMax: Number(job.salary_max),
				postedBy: job.posted_by,
				shiftType: job.shift_type,
				availableJoin: job.available_join,
				genderPreference: job.gender_preference,
				category: job.category,
				exServicemen: job.ex_servicemen ? Number(job.ex_servicemen) : null,//number | null,
				functionalArea: job.functional_area ? Number(job.functional_area) : null,
				jobId: job.job_id,
				agePreference: Number(job.age_preference),
				maxAge: job.max_age ? Number(job.max_age) : null,
				educationLevel: job.education_level,
				qualification: job.qualification,
				qualification2: job.qualification2,
				qualification3: job.qualification3,
				vacancies: Number(job.vacancies),
				differentlyAbled: Number(job.differently_abled),
				isActive: Number(job.isActive),
				createdAt: convertStringToDate(job.created_at),
			}
		});
	}catch(e){
		if(e instanceof AxiosError){
			console.log(e.response?.data);
		}else{
			console.log(e);
		}
	}
	return [];
}


async function getExps(): Promise<IExp[]>{
	try{
		const { data } = await PGRKAMAxios.get(EXP_PATH);
		if(!Array.isArray(data)){
			return [];
		}
		return data.map((exp: any)=>{
			return {
				id: Number(exp.id),
				name: exp.name,
				code: exp.code,
				description: exp.description,
			}
		});
	}catch(e){
		if(e instanceof AxiosError){
			console.log(e.response?.data);
		}else{
			console.log(e);
		}
	}
	return [];
}

async function getQualifications(): Promise<IQualification[]>{
	try{
		const { data } = await PGRKAMAxios.get(QUALIFICATION_PATH);
		if(!Array.isArray(data)){
			return [];
		}
		return data.map((qualification: any)=>{
			return {
				id: Number(qualification.id),
				name: qualification.name,
			}
		});
	}catch(e){
		if(e instanceof AxiosError){
			console.log(e.response?.data);
		}else{
			console.log(e);
		}
	}
	return [];
}

async function getStatesAndDistricts(): Promise<IStateAndDistrict[]>{
	try{
		const { data } = await PGRKAMAxios.get(STATE_DISTRICT_PATH);
		if(!Array.isArray(data)){
			return [];
		}
		//console.log(`data: ${JSON.stringify(data)}`);
		return data.map((state: any)=>{
			return {
				stateId: Number(state.state_id),
				stateName: state.state_name,
				dist: Array.isArray(state.dist) ?
					state.dist.map((district: any)=>{
					return {
						id: Number(district.id),
						name: district.name,
						description: district.description && district.description !== 'Null'? district.description : null
					}
				}) : []
			}
		});
	}catch(e){
		if(e instanceof AxiosError){
			console.log(e.response?.data);
		}else{
			console.log(e);
		}
	}
	return [];
}


async function getJobTypes(): Promise<IJobType[]>{
	try{
		const { data } = await PGRKAMAxios.get(JOB_TYPE_PATH);
		if(!Array.isArray(data)){
			return [];
		}
		return data.map((jobType: any)=>{
			return {
				id : Number(jobType.id),
				name: jobType.name,
				code: jobType.code,
				description: jobType.description && jobType.description !== 'Null' ?
					jobType.description : null
			}
		});
	}catch(e){
		if(e instanceof AxiosError){
			console.log(e.response?.data);
		}else{
			console.log(e);
		}
	}
	return [];
}


async function getJobTitles(): Promise<IJobTitle[]>{
	try{
		const { data } = await PGRKAMAxios.get(JOB_TITLE_PATH);
		if(!Array.isArray(data)){
			return [];
		}

		//console.log(`data = ${JSON.stringify(data)}`);

		return data.map((jobTitle: any) => {
			return {
				id: Number(jobTitle.id),
				jobTitle: jobTitle.job_title,
				jobDescription: jobTitle.job_description,
				isActive: Number(jobTitle.is_active),
				createdOn: new Date(jobTitle.created_on),
			}
		});
	}catch(e){
		if(e instanceof AxiosError){
			console.log(e.response?.data);
		}else{
			console.log(e);
		}
	}
	return [];
}


export {
	getPublicJobs,
	getPrivateJobs,
	getExps,
	getQualifications,
	getJobTypes,
	getJobTitles,
	getStatesAndDistricts,
};
