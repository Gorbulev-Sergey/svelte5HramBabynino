import type { Album } from '$lib/models/photos/Album.js';

export async function load({ fetch, params }) {
	let album: Album = await fetch(`/api/photos?uid=${params.uid}`).then(v => v.json());
	return {
		uid: params.uid,
		album: album
	};
}
