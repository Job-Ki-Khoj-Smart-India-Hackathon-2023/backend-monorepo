import { Schema, Types, model } from 'mongoose';
import educationSchema from './common/education-schema';
import experienceSchema from './common/experience-schema';
import contactSchema from './common/contact-schema';
import personalInfoSchema from './common/personal-info-schema';

const jobseekerInfoSchema = new Schema({
	userId: {
		type: Types.ObjectId,
		required: true,
		unique: true,// 1-1 relation
		ref: 'User'
	},
	profilePic: {
		url: {
			type: String
		},
		publicId: {
			type: String
		}
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


const jobseekerInfoModel = model('JobseekerInfo', jobseekerInfoSchema);


export default jobseekerInfoModel;
