import type { Album } from '$lib/models/photos/Album';

export async function load({ fetch }) {
	let albums = async (): Promise<[string, Album][]> =>
		await fetch(`/api/photos`).then(v => v.json());
	return {
		albums: Object.entries(await albums())
	};
}
