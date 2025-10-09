import { type IRole, Role } from './Role';

export interface IUser {
	uid: string;
	email: string;
	role: IRole;
}

export function User(uid: string = '', email: string = '', role: IRole = Role()) {
	return {
		uid,
		email,
		role
	};
}
