import { db } from '$lib/settings/firebase';
import { redirect } from '@sveltejs/kit';
import { get, ref } from 'firebase/database';

async function getPosts() {
	let data = await get(ref(db, '/posts'));
	return await data.val();
}

export async function GET({ request }) {
	let hostname = new URL(request.url).hostname;
	if (
		hostname == 'localhost' ||
		hostname == 'hram-babynino.ru' ||
		hostname == 'hram-babynino.netlify.app'
	)
		return new Response(JSON.stringify(await getPosts()));
	else new Response();
}
