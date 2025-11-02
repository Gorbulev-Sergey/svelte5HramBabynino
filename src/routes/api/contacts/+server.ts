import { db } from '$lib/settings/firebase';
import { get, ref } from 'firebase/database';
import { checkHost } from '../../(guest)/checkHostName.js';

async function getContacts() {
	let data = await get(ref(db, '/contacts'));
	return await data.val();
}

export async function GET({ request }) {
	return checkHost(request, await getContacts());
}
