import { db } from '$lib/settings/firebase';
import { get, ref } from 'firebase/database';

async function getPosts() {
	let data = await get(ref(db, '/posts'));
	return await data.val();
}

export async function GET() {
	return new Response(JSON.stringify(await getPosts()));
}
