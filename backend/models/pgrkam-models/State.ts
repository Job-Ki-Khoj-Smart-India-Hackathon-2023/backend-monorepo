import mongoose from 'mongoose';

const stateSchema = new mongoose.Schema({
	stateId: {
		type: Number,
		required: true,
		unique: true,
	},
	stateName: {
		type: String,
		required: true
	}
}, {timestamps: true});


stateSchema.index({stateId: 1}, {unique: true});
stateSchema.index({stateName: 1});

const State = mongoose.model('State', stateSchema);

export default State;

