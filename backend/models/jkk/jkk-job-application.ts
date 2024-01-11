import { Schema, Types, model } from 'mongoose';
import experienceSchema from '../common/experience-schema';
import educationSchema from '../common/education-schema';
import contactSchema from '../common/contact-schema';
import personalInfoSchema from '../common/personal-info-schema';

const jobApplicationSchema = new Schema({
	jobseekerUserId: {
		type: Types.ObjectId,
		required: true,
		ref: 'User'
	},
	jkkJobPostId: {
		type: Types.ObjectId,
		required: true,
		ref: 'JKKJobPost'
	},
	personalInfo: {
		type: personalInfoSchema,
		required: true
	},
	contactInfo: {
		type: contactSchema,
		required: true
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
