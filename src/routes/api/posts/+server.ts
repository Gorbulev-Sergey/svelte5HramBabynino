import { db } from '$lib/settings/firebase';
import { get, ref } from 'firebase/database';
import { checkHost, isHostEnabled } from '../../(guest)/checkHostName.js';

async function getPosts() {
	let data = await get(ref(db, '/posts'));
	return await data.val();
}

export async function GET({ request }) {
	return checkHost(request, await getPosts());
}
