import { Schema } from "mongoose";


const personalInfoSchema = new Schema({
	firstName:{
		type: String,
	},
	lastName:{
		type: String,
	},
	dob: {
		type: Date,
	},
	nationality: {
		type: String,
		enum: ['Indian', 'Other']
	},
	gender: {
		type: String,
		enum: ['Male', 'Female', 'Other'],
	}
}, {_id: false});


export default personalInfoSchema;
