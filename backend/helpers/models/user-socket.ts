import { Socket } from 'socket.io';


export default interface UserSocket extends Socket{
	userId?: string;
}
