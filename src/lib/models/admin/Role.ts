export interface IRole {
	name: string;
}

export class Role {
	name: string = '';
	constructor(name = '') {
		this.name = name;
	}
}
