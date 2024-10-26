import type { Album } from "$lib/models/photos/Album";

export async function load({ fetch }) {
	let response = await fetch(`/api/photos`);
	let albums = await response.json();
	return {
		albums: Object.entries(albums) as [string, Album][]
	};
}
