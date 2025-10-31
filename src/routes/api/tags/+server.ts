import { db } from '$lib/settings/firebase';
import { get, ref } from 'firebase/database';

async function getTags() {
	let data = await get(ref(db, '/tags'));
	return await data.val();
}

export async function GET() {
	return new Response(JSON.stringify(await getTags()));
}
