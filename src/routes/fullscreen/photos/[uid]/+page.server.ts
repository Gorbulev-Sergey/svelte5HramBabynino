import type { IAlbum } from '$lib/models/photos/Album.js';
import { proxyStorageUrls } from '$lib/settings/proxyStorage';
import { db } from '$lib/settings/firebase';
import { get, ref } from 'firebase/database';

export async function load({ fetch, params }) {
	let album: IAlbum = await (await get(ref(db, `/photos/${params.uid}`))).val();
	return {
		uid: params.uid,
		album: proxyStorageUrls(album)
	};
}
