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
	date = '',
	photos = [],
	cover = null
): IAlbum {
	return {
		title: title,
		description: description,
		date: date,
		photos: photos,
		cover: cover
	};
}
