import { SETTINGS } from '$lib/store/store.svelte';

export async function POST({ request }) {
	let { owner_id, album_id, v } = await request.json();
	let link = `https://api.vk.com/method/photos.get?owner_id=${owner_id}&album_id=${album_id}&access_token=${SETTINGS.vkAccessToken}&v=${v}`;
	let result = await fetch(link, {
		method: 'GET',
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
		}
	});
	return new Response(JSON.stringify(await result.json()));
}
