import { Socket } from 'socket.io';
import { IUser } from '../../models/user-model';


export default interface UserSocket extends Socket{
	user?: IUser;
}
