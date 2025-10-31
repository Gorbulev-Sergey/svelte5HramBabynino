import { SETTINGS } from '$lib/settings/settings.svelte';

export async function POST({ request }) {
	let { owner_id, album_id, v, offset = 0 } = await request.json();
	let link = `https://api.vk.com/method/photos.get?owner_id=${owner_id}&album_id=${album_id}&access_token=${SETTINGS.ADMIN.vk.accessToken}&v=${v}&offset=${offset}`;
	let result = await fetch(link, {
		method: 'GET',
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
		}
	});
	return new Response(JSON.stringify(await result.json()));
}
