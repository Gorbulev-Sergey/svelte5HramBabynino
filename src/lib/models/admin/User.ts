import { Role } from './Role';

export interface IUser {
	uid: string;
	email: string;
	role: Role;
}

export class User {
	uid: string = '';
	email: string = '';
	role: Role = new Role();
}
