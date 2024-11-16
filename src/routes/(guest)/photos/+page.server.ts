import type { Album } from '$lib/models/photos/Album.js';

export async function load({ fetch }) {
	let albums: { [key: string]: Album } = await fetch(`/api/photos`).then(v => v.json());
	return {
		albums: Object.entries(albums)
	};
}
