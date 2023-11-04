

interface IExp{
	id: number,
	name: string,
	code: string | null,
	description: string | null
}


interface IQualification{
	id: number,
	name: string,
}

interface IDistrict{
	id: number,
	name: string,
	description: string | null
}

interface IStateAndDistrict{
	stateId: number,
	stateName: string,
	dist: IDistrict[]
}

interface IJobType{
	id: number,
	name: string,
	code: string | null,
	description: string | null
}


interface IJobTitle{
	id: number,
	jobTitle: string,
	jobDescription: string,
	isActive: number,
	createdOn: Date
}



interface IPublicJob {
	id: number;
	companyName: string;
	govt: string;
	jobTitle: string;
	location: string;
	description: string;
	displayQualification: string;
	searchQualification: string;
	educationLevel: number;
	educationLevel2: number;
	searchQualification2: string;
	designation: string | null;
	minMark: string;
	districtId: number | null; // mostly null
	experience: string | null; // contains numbers, nil, and string
	specialization: string;
	minExperience: number | null; // 'min_exp' to 'minExperience'
	maxExperience: number | null; // 'max_exp' to 'maxExperience'
	salary: number | null; // mostly null
	genderPreference: string;
	genderSearch: string | null; // mostly null
	minAgeSearch: string | null; // mostly null
	minAge: number;
	maxAge: number;
	vacancy: number;
	lastDate: Date;
	walkInInterview: Date | null;
	postedOn: Date;
	pdfLink: string | null;
	applyLink: string | null;
	applyMode: string;//'Online&Offline' | 'Online' | 'Offline';
	remarks: string | null; 
	dbeesRemarks: string;
	dbeeReply: string;
	createdAt: Date;
	updatedAt: Date;
	postedBy: string;
	postedDbee: number;
}


interface IPrivateJob {
	id: number,
	orgId: number;
	orgName: string;
	jobTitle: string;
	designation: string | null;
	salaryType: string;
	description: string;
	minExperience: number | null; // 'min_exp' to 'minExperience', some values are null
	maxExperience: number | null; // 'max_exp' to 'maxExperience', some values are null
	relMinExp: number | null;
	relMaxExp: number | null;
	location: number[]; // Assuming location is an array of strings
	stateId: number[];
	natureOfJob: number | null;
	salaryMin: number;
	salaryMax: number;
	postedBy: string | null;
	shiftType: string | null;
	availableJoin: string | null;
	genderPreference: string,
	category: string | null;
	exServicemen: number | null;
	functionalArea: number | null;
	jobId: string | null;
	agePreference: number;
	maxAge: number | null;
	educationLevel: string;
	qualification: string | null;
	qualification2: string | null;
	qualification3: string | null;
	vacancies: number;
	differentlyAbled: number;
	isActive: number;
	createdAt: Date;
}

export {
	IExp,
	IQualification,
	IStateAndDistrict,
	IDistrict,
	IJobType,
	IJobTitle,
	IPublicJob,
	IPrivateJob 
}
