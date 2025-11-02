import { db } from '$lib/settings/firebase';
import { get, ref } from 'firebase/database';
import { isHostEnabled } from '../../(guest)/checkHostName.js';

export async function POST({ request }) {
	if (isHostEnabled(request)) {
		let { month } = await request.json();
		let data = await get(ref(db, `/schedule/${month.year}/${month.name}`));
		return new Response(JSON.stringify(await data.val()));
	} else return new Response(JSON.stringify(''));
}
