import { type Role } from './Role';

export interface User {
	uid: string;
	email: string;
	role: Role;
}
