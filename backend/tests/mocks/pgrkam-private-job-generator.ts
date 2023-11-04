import { IPrivateJob } from "../../controllers/pgrkam/types";

const generateRandomLocation = () => Math.floor(Math.random() * 100) + 1;
const districtLocationIdWithLocation = [658, 49, 46, 43, 37, 36, 41, 668, 40, 54, 47, 659, 48, 35, 44, 51, 53, 52, 39, 50];

const generateRandomDate = () => {
  const start = new Date(2022, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Function to generate a random job
const generateRandomJob = (id: number): IPrivateJob => ({
  id: id,
  orgId: Math.floor(Math.random() * 1000) + 1,
  orgName: `Organization ${id}`,
  jobTitle: `Job Title ${id}`,
  designation: Math.random() > 0.5 ? `Designation ${id}` : null,
  salaryType: Math.random() > 0.5 ? 'Hourly' : 'Monthly',
  description: `Job Description ${id}`,
  minExperience: Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 1 : null,
  maxExperience: Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 1 : null,
  relMinExp: Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 1 : null,
  relMaxExp: Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 1 : null,
  location: Array.from({ length: 3 }, ()=> districtLocationIdWithLocation[Math.floor(Math.random() * districtLocationIdWithLocation.length)]),
  stateId: Array.from({ length: 2 }, () => Math.floor(Math.random() * 50) + 1),
  natureOfJob: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : null,
  salaryMin: Math.floor(Math.random() * 50000) + 5000,
  salaryMax: Math.floor(Math.random() * 100000) + 50000,
  postedBy: Math.random() > 0.5 ? `User ${id}` : null,
  shiftType: Math.random() > 0.5 ? 'Day' : 'Night',
  availableJoin: Math.random() > 0.5 ? 'Immediate' : '2 Weeks',
  genderPreference: Math.random() > 0.5 ? 'Male' : 'Female',
  category: Math.random() > 0.5 ? 'IT' : 'Healthcare',
  exServicemen: Math.random() > 0.5 ? 1 : 0,
  functionalArea: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : null,
  jobId: Math.random() > 0.5 ? `JobID${id}` : null,
  agePreference: Math.floor(Math.random() * 10) + 20,
  maxAge: Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 30 : null,
  educationLevel: Math.random() > 0.5 ? 'Bachelor\'s' : 'Master\'s',
  qualification: Math.random() > 0.5 ? 'Degree A' : null,
  qualification2: Math.random() > 0.5 ? 'Degree B' : null,
  qualification3: Math.random() > 0.5 ? 'Degree C' : null,
  vacancies: Math.floor(Math.random() * 10) + 1,
  differentlyAbled: Math.floor(Math.random() * 5),
  isActive: 1,
  createdAt: generateRandomDate(),
});

export {
	generateRandomJob
};
