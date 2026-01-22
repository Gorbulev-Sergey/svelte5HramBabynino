import type { IAlbum } from '$lib/models/photos/Album.js';
import { db } from '$lib/settings/firebase';
import { get, ref } from 'firebase/database';

export async function load({ fetch, params }) {
	let album: IAlbum = await (await get(ref(db, `/photos/${params.uid}`))).val();
	return {
		uid: params.uid,
		album: album
	};
}
