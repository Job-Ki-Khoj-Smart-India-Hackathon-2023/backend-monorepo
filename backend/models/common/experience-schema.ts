import { Schema, model, Types } from 'mongoose';


const experienceSchema = new Schema({
	jobTitle: {
		type: String,
	},
	description: {
		type: String,
	},
	company: {
		type: String,
	},
	location: {
		type: String,
	},
	startDate: {
		type: Date,
	},
	endDate: {
		type: Date,
	},
}, {_id: true});


export default experienceSchema;
