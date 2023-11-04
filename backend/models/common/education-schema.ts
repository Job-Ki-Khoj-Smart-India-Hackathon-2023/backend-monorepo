import { Schema } from 'mongoose';

const educationSchema = new Schema({
	degree: {
		type: String,
	},
	score: {
		type: Number,
		validate: {
			validator: function(v: number) {
				return v >= 0 && v <= 100;
			},
			message: 'Score must be between 0 and 100'
		}
	},
	scoredOutOf: {
		type: Number,
		validate: {
			validator: function(v: number) {
				return v >= 0 && v <= 100;
			},
			message: 'Scored out of must be between 0 and 100'
		}
	},
	institute: {
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

export default educationSchema;
