export class Comment {
	text: string = '';
	created: string = new Date().toISOString().slice(0, 10);
	userUID: null = null;
	postUID: null = null;

	constructor(text = '', created = new Date().toISOString().slice(0, 10), userUID = null, postUID = null) {
		this.text = text;
		this.created = created;
		this.userUID = userUID;
		this.postUID = postUID;
	}
}
