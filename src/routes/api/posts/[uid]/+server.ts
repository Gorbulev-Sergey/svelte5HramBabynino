import { db } from '$lib/settings/firebase';
import { get, ref } from 'firebase/database';

export async function GET({ params }) {
	let post = await (await get(ref(db, `/posts/${params.uid}`))).val();
	return new Response(JSON.stringify(post));
}
