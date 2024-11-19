import type { Photo } from '$lib/models/photos/Photo';

export interface Album {
	title: string;
	description?: string;
	date: string;
	photos: Photo[];
	cover?: string;
}
