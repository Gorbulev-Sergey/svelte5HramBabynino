import type { IAlbum } from '$lib/models/photos/Album.js';

export async function load({ fetch }) {
	let albums: { [key: string]: IAlbum } = await fetch(`/api/photos`).then(v => v.json());
	return {
		albums: Object.entries(albums)
	};
}
