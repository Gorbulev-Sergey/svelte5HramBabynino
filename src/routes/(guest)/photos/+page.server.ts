import type { IAlbum } from '$lib/models/photos/Album.js';
import { db } from '$lib/settings/firebase';
import { get, ref } from 'firebase/database';

export async function load({ fetch }) {
	let albums: { [key: string]: IAlbum } = await (await get(ref(db, `/photos`))).val();
	return {
		albums: Object.entries(albums)
	};
}
