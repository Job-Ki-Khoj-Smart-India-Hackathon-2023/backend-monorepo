import mongoose from 'mongoose';


const pointSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ['Point'],
		required: true
	},
	coordinates: {
		type: [Number], // [longitude, latitude]
		required: true
	}
}, {_id: false});

export default pointSchema;
