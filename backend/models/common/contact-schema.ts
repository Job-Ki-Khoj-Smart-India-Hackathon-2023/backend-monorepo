import { Schema } from 'mongoose';

const contactSchema = new Schema({
	address: {
		type: String,
	},
	phoneNo: {
		type: String,
		validate: {
			validator: function(v: string) {
				return v.length === 10 && Number.isInteger(Number(v));
			},
			message: (props:any)=> `${props.value} is not a valid phone number!`
		},
	},
	socialMediaProfiles: {
		type: [String],
		required: true,
		default: []
	},
}, {_id: false});


export default contactSchema;
