

function isUrlValid(url: string){
	try{
		new URL(url);
		return true;
	}catch(e){
		return false;
	}
}


/**
* @param dateString: string in format "dd-mm-yyyy""
*/
function convertStringToDate(dateString: string){
	const dateParts = dateString.split('-').map((part) => parseInt(part));
	return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
}


export {
	isUrlValid,
	convertStringToDate
}
