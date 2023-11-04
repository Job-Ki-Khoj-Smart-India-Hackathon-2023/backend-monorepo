
import mongoose from 'mongoose';

const jobTitleSchema = new mongoose.Schema({
	id: {
		type: Number,
		required: true,
		unique: true
	},
	jobTitle: {
		type: String,
		required: true,
	},
	jobDescription: {
		type: String,
	},
	isActive: {
		type: Number
	},
	createdOn: {
		type: Date,
		required: true
	}
}, {timestamps: true});

jobTitleSchema.index({id: 1}, {unique: true});

const JobTitle = mongoose.model('JobTitle', jobTitleSchema);

export default JobTitle;
