import type { IPost } from '$lib/models/Post.js';
import type { ITag } from '$lib/models/Tag.js';
import { proxyStorageUrls } from '$lib/settings/proxyStorage';
import { db } from '$lib/settings/firebase';
import { get, ref } from 'firebase/database';

export async function load({ fetch }) {
	let posts: { [key: string]: IPost } = await (await get(ref(db, '/posts'))).val();
	let tags: ITag[] = await (await get(ref(db, '/tags'))).val();
	return {
		posts: Object.entries(proxyStorageUrls(posts) ?? {}),
		tags: tags
	};
}
