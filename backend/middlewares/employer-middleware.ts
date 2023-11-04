import { Response, NextFunction } from 'express';
import UserRequest from '../helpers/models/user-request';



function employerMiddleware(req: UserRequest, res: Response, next: NextFunction) {
	if(req.user?.role !== 'employer' && req.user?.role !== 'admin') {
		return res.status(401).json({
			message: 'Unauthorized'
		});
	}
	console.log(req.user?.role);
	next();
}


export default employerMiddleware;
