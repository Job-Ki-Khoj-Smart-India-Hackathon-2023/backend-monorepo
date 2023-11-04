import { Response, NextFunction } from 'express';
import UserRequest from '../helpers/models/user-request';



function jobseekerMiddleware(req: UserRequest, res: Response, next: NextFunction) {
	if(req.user?.role !== 'jobseeker' && req.user?.role !== 'admin') {
		return res.status(401).json({
			message: 'Unauthorized'
		});
	}
	next();
}


export default jobseekerMiddleware;
