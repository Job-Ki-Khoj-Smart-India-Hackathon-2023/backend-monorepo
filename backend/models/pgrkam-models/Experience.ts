import {Schema, model} from 'mongoose';


const experienceSchema = new Schema({
	id: {
		type: Number,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true
	},
	code: {
		type: String,
	},
	description: {
		type: String
	}
}, { timestamps: true});


experienceSchema.index({id: 1}, {unique: true});

const experienceModel = model('Experience', experienceSchema);

export default experienceModel;
