export class Tag {
	name: string = '';
	description: string = '';
	postUID: null = null;

	constructor(name = '', description = '', postUID = null) {
		this.name = name;
		this.description = description;
		this.postUID = postUID;
	}
}
