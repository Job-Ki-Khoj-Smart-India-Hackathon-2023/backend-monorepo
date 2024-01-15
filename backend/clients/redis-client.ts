import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL;
if(!REDIS_URL){
	throw new Error('REDIS_URL must be defined');
}

const redisClient = createClient({
	url: REDIS_URL
});

redisClient.connect()
.then(()=>{
	console.log('Connected to Redis');
})
.catch((err)=>{
	console.error(err);
});

redisClient.on('error', (err)=>{
	console.log(err);
});


type GeoData = {
	member: string,
	longitude: number,
	latitude: number,
}

type ContentJobPost = {
	id: string,
	data: string
}

// Intention of this class is to manage all the redis keys
class RedisManager{
	// Primary keys ( all keys will start from these prefixes )
	private AuthPrefix = "auth";
	private GeoPrefix = "geo";
	private ContentPrefix = "content";

	// Secondary keys ( comes after primary keys )
	private OtpPrefix = "otp";
	private JobPostPrefix = "job-post";
	private JobseekerPrefix = "jobseeker";

	// Derived keys ( these will be used to set/get values )
	private AuthOtpPrefix = this.AuthPrefix + ":" + this.OtpPrefix + ":";
	private GeoJobPostPrefix = this.GeoPrefix + ":" + this.JobPostPrefix;
	private ContentJobPostPrefix = this.ContentPrefix + ":" + this.JobPostPrefix + ":";

	private GeoJobseekerTempTTL = 5*60; // 5 mins
	private GeoJobseekerTempPrefix = this.GeoPrefix + ":" + this.JobseekerPrefix + ":temp:"; // used for settting ttl for geo set values (specifically for jobseeker)
	private GeoJobseekerPrefix = this.GeoPrefix + ":" + this.JobseekerPrefix; // For storing jobseeker's location
	private ContentJobseekerPrefix = this.ContentPrefix + ":" + this.JobseekerPrefix + ":"; // for storing jobseeker's information
	
 
	private redisClient;
	constructor(){
		this.redisClient = redisClient;

		const sub = redisClient.duplicate();
		sub.connect();
		sub.configSet("notify-keyspace-events", "Ex");
		sub.subscribe("__keyevent@0__:expired", (key) => {
			if(typeof key !== 'string') return;

			if(key.startsWith(this.GeoJobseekerTempPrefix)){ // Deleting jobseeker from geo spatial index 
				// delete corresponding geo key
				const userId = key.replace(this.GeoJobseekerTempPrefix, "");
				this.delGeoJobseeker(userId);
			}

			console.log(`Key = ${key} expired`);
		});
	}

	public async isConnected(): Promise<boolean>{
		return await this.redisClient.ping() === "PONG";
	}


	/**
	* To be used for storing jobseeker's location ( for gps interface for employer )
	* Member will be User's id
	*/
	public async addGeoJobseeker(jobseekerLocation: GeoData){
		const geoJobseekerTempKey = this.GeoJobseekerTempPrefix + jobseekerLocation.member;
		await this.redisClient.multi()
			.geoAdd(this.GeoJobseekerPrefix, jobseekerLocation)
			.setEx(geoJobseekerTempKey, this.GeoJobseekerTempTTL, '1')
			.exec();
		console.log(`adding geo jobseeker successful`);
	}
	public async getGeoJobseeker(lat: number, lng: number, kmRadius: number): Promise<string[]>{
		const jobseekerIds = await this.redisClient.geoSearch(this.GeoJobseekerPrefix, {latitude: lat, longitude: lng}, {radius: kmRadius, unit: 'km'});
		return jobseekerIds.flatMap(jobseekerId=>jobseekerId?[jobseekerId]:[]);
	}
	private async delGeoJobseeker(jobseekerId: string){ // only to be removed from ttl expiry of geojobseekertemp
		console.log(`removing ${jobseekerId} from geoindex`);
		await this.redisClient.zRem(this.GeoJobseekerPrefix, jobseekerId);
	}
	/**
	* These methods i.e. set,is,del(JobseekerInfoForNearbyEmployers) are to be used for jobseeker info that needs to be shown to the employer
	* when they use nearby (gps feature)
	*/
	public async setJobseekerInfoForNearbyEmployers(jobseekerId: string, data: any){
		const key = this.ContentJobseekerPrefix + jobseekerId;
		await this.redisClient.set(key, JSON.stringify(data));
	}
	public async isJobseekerInfoForNearbyEmployersSet(jobseekerId: string){
		const key = this.ContentJobseekerPrefix + jobseekerId;
		const res = await this.redisClient.exists(key);
		console.log(`isJobseekerInfoForNearbyEmployersSet = ${res}`);
		return res > 0;
	}
	public async delJobseekerInfoForNearbyEmployers(jobseekerId: string){
		const key = this.ContentJobseekerPrefix + jobseekerId;
		await this.redisClient.del(key);
	}
	public async getJobseekersInfoForNearbyEmployers(jobseekerIds: string[]){
		const keys = jobseekerIds.map(id=>this.ContentJobseekerPrefix+id);
		console.log(`getJobseekersInfoForNearbyEmployers keys = ${JSON.stringify(keys)}`);
		const infos = await this.redisClient.mGet(keys);
		console.log(`getJobseekersInfoForNearbyEmployers infos = ${JSON.stringify(infos)}`);
		return infos.flatMap(info=>info?[JSON.parse(info)]:[]);
	}




	/**
	*	For storing otps for authentication purposes
	*/
	public async setVerificationData(otp: number, data: string, seconds: number): Promise<void>{
		const key = this.AuthOtpPrefix + otp;
		await this.redisClient.setEx(key, seconds, data);
	}
	public async getVerificationData(otp: number): Promise<string|null>{
		const key = this.AuthOtpPrefix + otp;	
		return await this.redisClient.get(key);
	}
	public async delVerificationData(otp: number): Promise<void>{
		const key = this.AuthOtpPrefix + otp;
		await this.redisClient.del(key);
	}





	public async setContentJobPost(contentJobPost: ContentJobPost): Promise<void>{
		const key = this.ContentJobPostPrefix + contentJobPost.id;
		await this.redisClient.set(key, contentJobPost.data);
	}
	public async setContentJobPosts(contentJobPosts: ContentJobPost[]): Promise<void>{
		if(contentJobPosts.length === 0) return;
		contentJobPosts.forEach(cjp => cjp.id = this.ContentJobPostPrefix + cjp.id);
		const jobPosts = contentJobPosts.reduce((acc, cjp)=>{
			acc[cjp.id] = cjp.data;
			return acc;
		}, {} as {[key: string]: string});
		await this.redisClient.mSet(jobPosts);
	}
	public async getContentJobPost(jobPostId: string): Promise<string|null>{
		const key = this.ContentJobPostPrefix + jobPostId;
		return await this.redisClient.get(key);
	}
	public async delContentJobPost(jobPostId: string): Promise<void>{
		const key = this.ContentJobPostPrefix + jobPostId;
		await this.redisClient.del(key);
	}
	public async delContentJobPosts(jobPostIds: string[]): Promise<void>{ 
		if(jobPostIds.length === 0) return;
		const keys = jobPostIds.map(jobPostId => this.ContentJobPostPrefix + jobPostId);
		await this.redisClient.del(keys);
	}
	public async getContentJobPosts(jobPostIds: string[]): Promise<string[]>{
		if(jobPostIds.length === 0) return [];
		const keys = jobPostIds.map(jobPostId => this.ContentJobPostPrefix + jobPostId);
		const jobPosts = await this.redisClient.mGet(keys);
		return jobPosts.flatMap(jobPost => jobPost ? [jobPost] : []);
	}
	public async addGeoJobPost(geoJobPost: GeoData): Promise<void>{
		await this.redisClient.geoAdd(this.GeoJobPostPrefix, geoJobPost);
	}
	public async addGeoJobPosts(geoJobPosts: GeoData[]): Promise<void>{
		if(geoJobPosts.length === 0) return;
		await this.redisClient.geoAdd(this.GeoJobPostPrefix, geoJobPosts);
	}
	public async delGeoJobPost(jobPostId: string): Promise<void>{
		await this.redisClient.zRem(this.GeoJobPostPrefix, jobPostId);
	}
	public async delGeoJobPosts(jobPostIds: string[]): Promise<void>{
		if(jobPostIds.length === 0) return;
		await this.redisClient.zRem(this.GeoJobPostPrefix, jobPostIds);
	}
	public async getGeoJobPostIds(lat: number, lng: number, kmRadius: number): Promise<string[]>{
		const jobPosts = await this.redisClient.geoSearch(this.GeoJobPostPrefix, {latitude: lat, longitude: lng}, {radius: kmRadius, unit: 'km'});
		return jobPosts.flatMap(jobPost=>jobPost?[jobPost]:[]);
	}
}

export default redisClient;
export const redisManager = new RedisManager();
