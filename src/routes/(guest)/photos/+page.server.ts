import type { Album } from '$lib/models/photos/Album';

export async function load({ fetch }) {
	let albums = async (): Promise<[string, Album][]> => await (await fetch(`/api/photos`)).json();
	return {
		albums: Object.entries(await albums())
	};
}
