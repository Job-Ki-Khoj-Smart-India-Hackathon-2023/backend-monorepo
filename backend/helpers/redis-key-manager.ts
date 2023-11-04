export default class RedisKeyManager{
	private static VERIFICATION_PREFIX = "verification:";
	private static GEO_JOB_POST_PREFIX = "job-post";
	private static GEO_JOB_POST_CONTENT_PREFIX = "job-post-content:";


	public static getOTPVerificationKey(otp: string): string{
		return RedisKeyManager.VERIFICATION_PREFIX + otp;
	}


	public static getGeoSpatialJobPostKey(): string{
		return RedisKeyManager.GEO_JOB_POST_PREFIX;	
	}

	public static getGeoSpatialJobPostContentKey(uuid: string): string{
		return `${RedisKeyManager.GEO_JOB_POST_CONTENT_PREFIX}${uuid}`;
	}

}


