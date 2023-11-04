

function generateOtp(digits: number){
	const min = Math.pow(10, digits - 1);
	const max = Math.pow(10, digits) - 1; 
	//return String(Math.floor(min + Math.random() * (max-min+1)));
	return Math.floor(min + Math.random() * (max-min+1));
}


export {
	generateOtp
}
