import mongoose from 'mongoose';
import pointSchema from './common/PointSchema';

const privateJobSchema = new mongoose.Schema({
	metadata: {
		location: {
			type: pointSchema
		},
		//redisGeoKey: {
		//	type: String // to be removed
		//}
	},
	id: { // we will be storing duplicates in case of multiple locations 
		type: Number,
		
	},
	orgId: {
		type: Number,
		
	},
	orgName: {
		type: String,
		
	},
	jobTitle: {
		type: String,
		
	},
	designation: { type: String },
	salaryType: { type: String },
	description: { type: String },
	minExperience: { type: Number},
	maxExperience: { type: Number},
	relMinExp: { type: Number },
	relMaxExp: { type: Number },
	location: [{
		type: Number,
		
	}], // Assuming location is an array of strings
	stateId: [{ type: Number }],
	natureOfJob: { type: Number },
	salaryMin: { type: Number },
	salaryMax: { type: Number },
	postedBy: {type:String},
	shiftType: {type:String},
	availableJoin: {type:String},
	genderPreference: {type:String}, 
	category: {type:String},
	exServicemen: {type:Number},
	functionalArea: { type: Number},
	jobId: {type: String},
	agePreference: {type: Number}, 
	maxAge: {type:Number},
	educationLevel: {type: String},
	qualification: {type:String},
	qualification2: {type:String},
	qualification3: {type:String},
	vacancies: {type: Number}, 
	differentlyAbled: {type: Number}, 
	isActive: {type: Number}, 
	createdAt: {type: Date}, 
});

privateJobSchema.index({ 'metadata.location': '2dsphere' });


export default mongoose.model('PrivateJob', privateJobSchema);

