export interface IRole {
	name: string;
}

export function Role(name: string = '') {
	return {
		name
	};
}
