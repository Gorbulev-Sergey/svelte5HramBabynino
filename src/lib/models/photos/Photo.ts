export class Photo {
	title: string | null = null;
	url: string = '';

	constructor(title = null, url = '') {
		this.title = title;
		this.url = url;
	}
}
