# Job Ki Khoj

## Overview

"Job Ki Khoj" is a LinkedIn-like job portal designed for employers and job seekers to post and apply for job opportunities. Initially developed for the SIH2023 Hackathon for the Punjab Government's PGRKAM website, this project serves as an extension to the existing job portal, introducing additional features. The backend components consist of two services: the server and the ML service. The server manages user requests, while the ML service, connected via gRPC, handles recommendation-related tasks.

### Key Features

1. **Job Fetching:**
   - The platform fetches jobs from the PGRKAM official website.
   - Github actions are used to initiate fetch job requests to PGRKAM API.

2. **Real-Time Updates:**
   - Job seekers receive real-time updates on nearby job posts based on their location.
   - Employers can access real-time updates on job seekers near their location.

3. **Job Recommendations:**
   - Job posts are recommended to job seekers based on their history.

4. **User Interaction:**
   - Employers can post job opportunities directly on the platform.
   - Job seekers can create profiles showcasing their skills and experiences.
   - Job seekers can apply to jobs posted on the platform, providing a seamless user experience for both employers and job seekers.

### Important Workflows/Diagrams

#### 1. Backend Overview

![Backend Overview Diagram](https://github.com/Job-Ki-Khoj-Smart-India-Hackathon-2023/backend-monorepo/assets/95378716/c3b7e2b0-d538-4017-bea2-9cf9f939e872)

#### 2. PGRKAM Job Post Fetching Flow

![PGRKAM Job Post Fetching Flow Diagram](https://github.com/Job-Ki-Khoj-Smart-India-Hackathon-2023/backend-monorepo/assets/95378716/1e076ad0-30a4-48dd-a75e-f80e50540e77)

#### 3. Jobseeker Nearby Jobs Real-Time Updates Flow

![Jobseeker Nearby Jobs Real-Time Updates Flow Diagram](https://github.com/Job-Ki-Khoj-Smart-India-Hackathon-2023/backend-monorepo/assets/95378716/51a31898-39d9-411a-9538-0db379dcbb55)

#### 4. Employers GPS Interface Flow

![Employers GPS Interface Flow Diagram](https://github.com/Job-Ki-Khoj-Smart-India-Hackathon-2023/backend-monorepo/assets/95378716/9bacb7b0-6f29-4a3b-83d1-684cb1e0fdb4)

## Postman Documentation

**In Progress**

## Setup

To set up the project, follow these steps:

1. Create a `.env.dev` file in the `backend/` directory with the following variables:

   ```env
   NODE_ENV=development
   ML_SERVICE_URI=ml:50051
   MONGO_URI=mongodb://mongo:27017/sih
   REDIS_URL=redis://redis:6379
   JWT_SECRET=
   PGRKAM_BASE_URL=https://pgrkamadmin.pgrkam.com/m_api/v1/index.php
   MAPS_API_KEY=
   MAIL_SERVICE_API_KEY=
   CLOUDINARY_URL=
   ```

2. In the `ml/` directory, create a `.env.dev` file and set:

   ```env
   ADDR=0.0.0.0:50051
   ```

3. Run the application using Docker Compose:

   ```bash
   docker-compose -f compose.dev.yaml up
   ```

## Usage

With the application running, users can make requests to the "Job Ki Khoj" platform, benefiting from the extended functionalities seamlessly integrated into the job portal.


