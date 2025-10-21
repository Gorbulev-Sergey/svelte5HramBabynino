import type { IPhoto } from '$lib/models/photos/Photo';

export interface IAlbum {
	title: string;
	description: string | null;
	date: string;
	photos: IPhoto[];
	cover: string | null;
}

export function Album(
	title = '',
	description = null,
	date = new Date().toISOString().slice(0, 10),
	photos: IPhoto[] = [],
	cover = null
): IAlbum {
	return {
		title,
		description,
		date,
		photos,
		cover
	};
}
