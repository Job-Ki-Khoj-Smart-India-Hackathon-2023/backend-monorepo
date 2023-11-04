import redisClient, { redisManager } from "../../clients/redis-client";
import { generateOtp } from "../../helpers/otp-generator";
import dotenv from 'dotenv';

const TIMEOUT = 10_000;
const OTP_TIMEOUT = 10;

dotenv.config();

describe('Redis manager', ()=>{

	console.log('node env',process.env.NODE_ENV);

	afterAll(async () => {
		await redisClient.flushAll();
	});

	describe('verification data', ()=>{
		test('should store, retrieve data, and delete data', async () => {
			const otp = generateOtp(6);
			const data = JSON.stringify({
				otp,
				userId: '1234567890',
				createdAt: Date.now()
			});
			await redisManager.setVerificationData(otp, data, OTP_TIMEOUT);

			let verificationData = await redisManager.getVerificationData(otp);
			expect(verificationData).toEqual(data);

			await redisManager.delVerificationData(otp);

			verificationData = await redisManager.getVerificationData(otp);
			expect(verificationData).toEqual(null);

		}, TIMEOUT);

		test('should store, let data expire and get null as a result', async () => {
			const otp = generateOtp(6);
			const data = JSON.stringify({
				otp,
				userId: '1234567890',
				createdAt: Date.now()
			});
			await redisManager.setVerificationData(otp, data, OTP_TIMEOUT);
			await new Promise((res)=>setTimeout(res,(OTP_TIMEOUT+5)*1_000));
			const verificationData = await redisManager.getVerificationData(otp);
			expect(verificationData).toEqual(null);
		}, TIMEOUT+(OTP_TIMEOUT*1000));
	});

	describe('Content job post', ()=>{
		const jobId = '1234567890';
		const jobPost = JSON.stringify({	
			"content": {
				"jobTitle": "Software Developer",
				"jobDescription": "The job description",
				"jobType": "Full-Time",
				"jobIndustry": "IT",
				"jobLocation": "Lagos",
				"jobSalary": "200000",
				"jobApplicationDeadline": "2020-12-31T00:00:00.000Z"
			},
			"geo": {
				"location": {
					"lat": 6.465422,
					"lng": 3.406448
				},
				"radius": 0.1
			}
		});

		test('should set, get and delete job post content', async()=>{
			// set
			await redisManager.setContentJobPost({id: jobId, data: jobPost});

			// get
			const retrievedJobPost = await redisManager.getContentJobPost(jobId);
			expect(retrievedJobPost).toEqual(jobPost);

			// delete
			await redisManager.delContentJobPost(jobId);
			const deletedJobPost = await redisManager.getContentJobPost(jobId);
			expect(deletedJobPost).toEqual(null);
		},TIMEOUT);

		test('should be able to get array of job posts for corresponding ids', async()=>{
			const jobIds = [];
			const len = 10;
			for (let i = 0; i < len; i++) {
				jobIds.push(`${Math.random()*1000}`);
			}

			const jobPosts = jobIds.map(id=>{
				return { id, data: jobPost};
			});

			await redisManager.setContentJobPosts(jobPosts);
			const retrievedJobPosts = await redisManager.getContentJobPosts(jobIds);
			expect(retrievedJobPosts.length).toEqual(jobPosts.length);
			//console.log('multiple retrieved values for job post content=',retrievedJobPosts);
		},TIMEOUT);
	}); 

	describe('Geo job post', ()=>{
		const evenCoordinate = {
			latitude: 6.465422,
			longitude: 3.406448,
		};
		const oddCoordinate = {
			latitude: 10.392093,
			longitude: 7.291029,
		};

		test('should set, get and delete geo job post from geo index', async()=>{
			const jobId = '1';
			const { latitude, longitude } = evenCoordinate;
			await redisManager.addGeoJobPost({member: jobId, latitude, longitude});

			// set
			const retrievedJobPost = await redisManager.getGeoJobPostIds(latitude, longitude, 10);

			// get
			expect(retrievedJobPost.length).toEqual(1);
			expect(retrievedJobPost[0]).toEqual(jobId);

			// delete
			await redisManager.delGeoJobPost(jobId);
			const deletedJobPost = await redisManager.getGeoJobPostIds(latitude, longitude, 10);
			expect(deletedJobPost.length).toEqual(0);

		}, TIMEOUT);

		test('should return 5 job posts for odd and even with respect to even or odd coordinate', async ()=>{
			const jobPosts = [1,2,3,4,5,6,7,8,9,10].map(i=>{
				const coordinates = (i%2===0)?evenCoordinate:oddCoordinate;
				return {
					member: `${i}`,
					...coordinates
				}
			});

			// setting
			await redisManager.addGeoJobPosts(jobPosts);

			// checking for even coordinate
			let { latitude: lat, longitude:lng } = evenCoordinate;
			let retrievedJobPosts = await redisManager.getGeoJobPostIds(lat, lng, 10);
			expect(retrievedJobPosts.length).toEqual(5);
			expect(retrievedJobPosts.every(jpId=>Number(jpId)%2===0)).toEqual(true);

			// checking for odd coordinate
			lat = oddCoordinate.latitude;
			lng = oddCoordinate.longitude;
			retrievedJobPosts = await redisManager.getGeoJobPostIds(lat, lng, 10);
			expect(retrievedJobPosts.length).toEqual(5);
			expect(retrievedJobPosts.every(jpId=>Number(jpId)%2!==0)).toEqual(true);

			// deleting all job posts
			await redisManager.delGeoJobPosts(jobPosts.map(jp=>jp.member));

			// --------checking deletion-------------
			// for even coordinates
			lat = evenCoordinate.latitude;
			lng = evenCoordinate.longitude;
			retrievedJobPosts = await redisManager.getGeoJobPostIds(lat, lng, 10);
			expect(retrievedJobPosts.length).toEqual(0);

			// for odd coordinates
			lat = oddCoordinate.latitude;
			lng = oddCoordinate.longitude;
			retrievedJobPosts = await redisManager.getGeoJobPostIds(lat, lng, 10);
			expect(retrievedJobPosts.length).toEqual(0);

		}, TIMEOUT);
	});

	describe('Content and Geo job post Mix', ()=>{

		const jobPost = {
			member: `${generateOtp(50)}`,
			latitude: 1,
			longitude: 1,
			data: 'content'
		};

		test('should add and retrieve job post', async ()=>{
			//add job post
			await redisManager.addGeoJobPost({member: jobPost.member, latitude: jobPost.latitude, longitude: jobPost.longitude});
			await redisManager.setContentJobPost({id:jobPost.member, data: jobPost.data});
			
			// retrieve job post
			const retrievedJobPosts = await redisManager.getGeoJobPostIds(jobPost.latitude, jobPost.longitude, 10);
			expect(retrievedJobPosts.length).toEqual(1);
			expect(retrievedJobPosts[0]).toEqual(jobPost.member);

			const retrievedJobPostContent = await redisManager.getContentJobPost(jobPost.member);
			expect(retrievedJobPostContent).toEqual(jobPost.data);

			// delete job post
			await redisManager.delGeoJobPost(jobPost.member);
			await redisManager.delContentJobPost(jobPost.member);
		}, TIMEOUT);
	});
});
