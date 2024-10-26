import type { Album } from '$lib/models/photos/Album.js';

export async function load({ fetch, params }) {
	let response = await fetch(`/api/photos?uid=${params.uid}`);
	let album = await response.json();
	return {
		uid: params.uid,
		album: album as Album
	};
}
