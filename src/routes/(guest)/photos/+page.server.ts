import type { IAlbum } from '$lib/models/photos/Album.js';
import { proxyStorageUrls } from '$lib/settings/proxyStorage';
import { db } from '$lib/settings/firebase';
import { get, ref } from 'firebase/database';

export async function load({ fetch }) {
	let albums: { [key: string]: IAlbum } = await (await get(ref(db, `/photos`))).val();
	return {
		albums: Object.entries(proxyStorageUrls(albums) ?? {})
	};
}
