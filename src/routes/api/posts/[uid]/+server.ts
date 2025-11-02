import { db } from '$lib/settings/firebase';
import { get, ref } from 'firebase/database';
import { isHostEnabled } from '../../../(guest)/checkHostName';

export async function GET({ params, request }) {
	if (isHostEnabled(request)) {
		let post = await (await get(ref(db, `/posts/${params.uid}`))).val();
		return new Response(JSON.stringify(post));
	} else return new Response(JSON.stringify(''));
}
