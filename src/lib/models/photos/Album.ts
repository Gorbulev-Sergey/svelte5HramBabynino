import type { Photo } from '$lib/models/photos/Photo';

export class Album {
	title: string = '';
	description: string | null;
	date: string = new Date().toISOString().slice(0, 10);
	photos: Photo[] = [];
	cover: string | null = null;

	constructor(title = '', description = null, date = new Date().toISOString().slice(0, 10), photos = [], cover = null) {
		this.title = title;
		this.description = description;
		this.date = date;
		this.photos = photos;
		this.cover = cover;
	}
}
