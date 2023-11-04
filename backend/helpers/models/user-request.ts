import { Request } from 'express';
import {IUser} from '../../models/user-model';


interface UserRequest extends Request{
	user?: IUser;
}


export default UserRequest;
