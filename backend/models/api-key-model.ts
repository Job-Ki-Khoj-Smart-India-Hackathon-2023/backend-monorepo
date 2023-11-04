import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema({
	apiKey: {
		type: String,
		unique: true,
		required: true,
	}
}, {timestamps: true});


apiKeySchema.index({apiKey:1}, {unique: true});


export default mongoose.model('ApiKey', apiKeySchema);
