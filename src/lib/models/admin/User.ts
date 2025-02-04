import { type IRole } from './Role';

export interface IUser {
	uid: string;
	email: string;
	role: IRole;
}
