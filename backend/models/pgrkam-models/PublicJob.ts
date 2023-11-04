import mongoose from 'mongoose';
import pointSchema from './common/PointSchema';

const publicJobSchema = new mongoose.Schema({
	metadata: {
		location: {
			type: pointSchema
		},
		redisGeoKey:{
			type: String
		}
	},
	id: {
		type: Number,
		
	},
	companyName: {
		type: String,
		
	},
	govt: {
		type: String,
		
	},
	jobTitle: {
		type: String,
		
	},
	location: { 
		type: String, 
		
	},
	description: {
		type: String,
	},
	displayQualification: {
		type: String,
		
	},
	searchQualification: {
		type: String,
		
	},
	educationLevel: {
		type: Number,
		
	},
	educationLevel2: {
		type: Number,
		
	},
	searchQualification2: {
		type: String,
		
	},
	designation: { type: String },
	districtId: { type: Number }, // mostly null
	experience: { type: String }, // contains numbers, nil, and string
	specialization: {
		type: String,
		
	},
	minExperience: { type: Number }, // 'min_exp' to 'minExperience'
	maxExperience: { type: Number }, // 'max_exp' to 'maxExperience'
	salary: { type: Number }, // mostly null
	genderPreference: {
		type: String,
		
	},
	genderSearch: { type: String }, // mostly null
	minAgeSearch: { type: String }, // mostly null
	minAge: {
		type: Number,
		
	},
	maxAge: {
		type: Number,
		
	},
	vacancy: {
		type: Number,
		
	},
	lastDate: {
		type: Date,
		
	},
	walkInInterview: { type: Date },
	postedOn: {
		type: Date,
		
	},
	pdfLink: { type: String },
	applyLink: { type: String },
	applyMode: {
		type: String,
		
	},//'Online&Offline' | 'Online' | 'Offline',
	remarks: { type: String }, 
	createdAt: {
		type: Date,
		
	},
	updatedAt: {
		type: Date,
		
	},
	postedBy: {
		type: String,
		
	}
});

publicJobSchema.index({'metadata.location': '2dsphere'});

export default mongoose.model('PublicJob', publicJobSchema);
