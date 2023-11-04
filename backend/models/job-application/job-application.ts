import { Schema, Types, model } from 'mongoose';
import experienceSchema from '../common/experience-schema';
import educationSchema from '../common/education-schema';


const jobApplicationSchema = new Schema({
	jobseekerUserId: {
		type: Types.ObjectId,
		required: true,
		ref: 'User'
	},

	jobPostId: {
		type: Types.ObjectId,
		required: true,
		ref: 'JobPost'
	},

	education: {
		type: [educationSchema],
		required: true,
		default: []
	},

	experience: {
		type: [experienceSchema],
		required: true,
		default: []
	},

	skills: {
		type: [String],
		required: true,
		default: []
	}

}, {timestamps: true});


const jobApplicationModel = model('JobApplication', jobApplicationSchema);


export default jobApplicationModel;
