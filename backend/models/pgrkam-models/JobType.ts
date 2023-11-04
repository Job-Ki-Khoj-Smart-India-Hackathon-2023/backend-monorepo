import mongoose from 'mongoose';

const jobTypeSchema = new mongoose.Schema({
	id: {
		type: Number,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true
	},
	code: {
		type: String
	},
	description: {
		type: String
	}

},{timestamps: true});

const JobType = mongoose.model('JobType', jobTypeSchema);

export default JobType;
