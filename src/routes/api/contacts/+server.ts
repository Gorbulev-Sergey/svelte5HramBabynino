import { db } from '$lib/settings/firebase';
import { get, ref } from 'firebase/database';

async function getContacts() {
	let data = await get(ref(db, '/contacts'));
	return await data.val();
}

export async function GET() {
	return new Response(JSON.stringify(await getContacts()));
}
