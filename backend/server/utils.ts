

/**
*
* TODO Remove this in future (unsafe)
* */
function isStringJsonParseable(data: string){
	try{
		JSON.parse(data);
		return true;
	}catch(err){
		return false;
	}
}


export {
	isStringJsonParseable
}
