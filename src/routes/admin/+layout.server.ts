import type { IAlbum } from '$lib/models/photos/Album.js';
import type { IPost } from '$lib/models/Post.js';
import type { ITag } from '$lib/models/Tag.js';

export async function load({ fetch }) {
	let tags: ITag[] = await fetch('/api/tags').then(v => v.json());
	let albums: { [key: string]: IAlbum } = await fetch('/api/photos').then(v => v.json());
	return {
		tags: tags,
		albums: Object.entries(albums)
	};
}
