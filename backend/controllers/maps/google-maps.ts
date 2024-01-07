import axios from 'axios';

const MAPS_BASE_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json";
const MAPS_API_KEY = process.env.MAPS_API_KEY;
if(!MAPS_API_KEY){
	throw new Error('MAPS_API_KEY must be defined');
}

async function getCoordinatesFromText(text: string) : Promise<{lat: number, lng: number} | null>{
	console.log('using google maps api');
	//const {data, status} = await axios.get(MAPS_BASE_URL, {
	//	params: {
	//		query: text,
	//		key: MAPS_API_KEY
	//	}
	//});

	//if(status!==200){
	//	return null;
	//}

	//const location = data.results[0]?.geometry?.location;
	//if(!location){
	//	return null;
	//}

	const location = {
		lat: 37.7749,
		lng: -122.4194
	};

	const { lat, lng } = location as {lat: number, lng: number};
	console.log(`text ${text} has coordinates ${lat}, ${lng}`);

	return {
		lat,
		lng
	}
}


export {
	getCoordinatesFromText
}
