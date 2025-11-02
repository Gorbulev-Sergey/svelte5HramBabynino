import { db } from '$lib/settings/firebase';
import { get, ref } from 'firebase/database';
import { checkHost } from '../../(guest)/checkHostName';

async function getTags() {
	let data = await get(ref(db, '/tags'));
	return await data.val();
}

export async function GET({ request }) {
	return checkHost(request, await getTags());
}
