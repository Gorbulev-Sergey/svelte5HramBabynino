import { db } from '$lib/settings/firebase';
import { get, ref } from 'firebase/database';

export async function POST({ request }) {
	let { month } = await request.json();
	let data = await get(ref(db, `/schedule/${month.year}/${month.name}`));
	return new Response(JSON.stringify(await data.val()));
}
