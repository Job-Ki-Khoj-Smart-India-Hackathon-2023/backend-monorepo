import mongoose from 'mongoose';

const qualificationSchema = new mongoose.Schema({
	id: {
		type: Number,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true
	},
},{timestamps: true});

const QualificationModel = mongoose.model('Qualification', qualificationSchema);

export default QualificationModel;
