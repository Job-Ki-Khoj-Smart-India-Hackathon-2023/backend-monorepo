import { RedisClientType, createClient } from "redis";

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


type GeoJobPost = {
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

	// Derived keys ( these will be used to set/get values )
	private AuthOtpPrefix = this.AuthPrefix + ":" + this.OtpPrefix + ":";
	private GeoJobPostPrefix = this.GeoPrefix + ":" + this.JobPostPrefix;
	private ContentJobPostPrefix = this.ContentPrefix + ":" + this.JobPostPrefix + ":";
 
	private redisClient;
	constructor(){
		this.redisClient = redisClient;
	}

	public async isConnected(): Promise<boolean>{
		return await this.redisClient.ping() === "PONG";
	}

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
	public async delContentJobPosts(jobPostIds: string[]): Promise<void>{ // TODO: Test this method
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
	
	public async addGeoJobPost(geoJobPost: GeoJobPost): Promise<void>{
		await this.redisClient.geoAdd(this.GeoJobPostPrefix, geoJobPost);
	}
	public async addGeoJobPosts(geoJobPosts: GeoJobPost[]): Promise<void>{
		if(geoJobPosts.length === 0) return;
		await this.redisClient.geoAdd(this.GeoJobPostPrefix, geoJobPosts);
	}
	public async delGeoJobPost(jobPostId: string): Promise<void>{
		await this.redisClient.zRem(this.GeoJobPostPrefix, jobPostId);;
	}
	public async delGeoJobPosts(jobPostIds: string[]): Promise<void>{
		if(jobPostIds.length === 0) return;
		await this.redisClient.zRem(this.GeoJobPostPrefix, jobPostIds);;
	}
	public async getGeoJobPostIds(lat: number, lng: number, kmRadius: number): Promise<string[]>{
		const jobPosts = await this.redisClient.geoSearch(this.GeoJobPostPrefix, {latitude: lat, longitude: lng}, {radius: kmRadius, unit: 'km'});
		return jobPosts.flatMap(jobPost=>jobPost?[jobPost]:[]);
	}
}

export default redisClient;
export const redisManager = new RedisManager();
