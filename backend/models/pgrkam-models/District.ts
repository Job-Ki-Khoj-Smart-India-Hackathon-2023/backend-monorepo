import mongoose from 'mongoose';
import pointSchema from './common/PointSchema';

const districtSchema = new mongoose.Schema({
	stateId: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'State'
	},
	id: {
		type: Number,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String	
	},

	location: {
		type: pointSchema
	}
}, {timestamps: true});


districtSchema.index({location: '2dsphere'});

const District = mongoose.model('District', districtSchema);


export default District;
