import { Schema, Types, model } from "mongoose";
import pointSchema from "../pgrkam-models/common/PointSchema";


const jobPostSchema = new Schema({
	metadata: {
		location: {
			type: pointSchema,
			required: true
		},
		redisGeoKey: {
			type: String
		},
		status: {
			type: String,
			required: true,
			enum: ['open','under-review','interviewing','closed'],
		}
	},
	employer:{
		userId: {
			type: Types.ObjectId,
			required: true,
			ref: 'User'
		},
		userInfoId: {
			type: Types.ObjectId,
			required: true,
			ref: 'EmployerInfo'
		}
	},
	companyName: {
		type: String,
		required: true
	},
	jobInfo: {
		title: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true,
		},
		genderPreference: {
			type: String,
			enum: ['Male', 'Female', 'Other'],
		},
		education: {
			type: String,
		},
		vacancies: {
			type: Number,
			required: true,
			validate: {
				validator: function(v: number){
					return v > 0;
				}
			},
			message: 'Vacancies must be greater than 0'
		},
		salary: {
			min: {
				type: Number,
				validate: {
					validator: function(v: number|undefined|null){
						if(typeof v === 'number'){
							return v > 0;
						}
						return true;
					},
				}
			},
			max: {
				type: Number,
				validate: {
					validator: function(v: number|undefined|null){
						if(typeof v === 'number'){
							return v > 0;
						}
						return true;
					},
				}
			}
		},
		responsibilities: {
			type: [String],
			required: true,
			default: []
		},
		requiredSkills: {
			type: [String],
			required: true,
			default: []
		},
	},
	tags: {
		type: [String],
		required: true,
		default: []
	}
}, {timestamps: true});

jobPostSchema.index({'metadata.location': '2dsphere'});

const jobPostModel = model('JobPost', jobPostSchema);

export default jobPostModel;
