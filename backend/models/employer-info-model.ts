import { Schema, Types, model } from 'mongoose';
import personalInfoSchema from './common/personal-info-schema';
import contactInfoSchema from './common/contact-schema';


const employerInfoSchema = new Schema({
	userId: {
		type: Types.ObjectId,
		required: true,
		unique: true,// 1-1 relation
		ref: 'User'
	},
	personalInfo: {
		type: personalInfoSchema,
		required: true
	},
	contactInfo: {
		type: contactInfoSchema,
		required: true
	},
	profilePic: {
		url: {
			type: String
		},
		publicId: {
			type: String
		}
	},
});

const employerInfoModel = model('EmployerInfo', employerInfoSchema);

export default employerInfoModel;
