import axios from 'axios';

interface MailOptions{
	email: string;
	subject: string;
	message: string;
}

const BASE_URL = 'https://api.courier.com';

async function sendMail(options: MailOptions){
	
	if(process.env.NODE_ENV === 'test'){
		return;
	}

	const response = await axios.post(`${BASE_URL}/send`, {
		message: {
			to: {
				email: options.email
			},
			content: {
				title: options.subject,
				body: options.message
			}
		}
	}, {
		headers: {
			'Authorization': `Bearer ${process.env.MAIL_SERVICE_API_KEY}`
		}
	});

	console.log(JSON.stringify(response.data));
	console.log(response.status);
}


export {
	sendMail,
	MailOptions
};
