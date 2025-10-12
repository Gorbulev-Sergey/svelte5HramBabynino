import { SETTINGS } from '$lib/store/store.svelte';

export async function POST({ request }) {
	let { owner_id, title, v } = await request.json();
	let link = `https://api.vk.com/method/photos.createAlbum?access_token=${SETTINGS.vkAccessToken}&owner_id=${owner_id}&title=${title}&v=${v}`;
	let result = await fetch(link, {
		method: 'POST',
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
		}
	});
	return new Response(JSON.stringify(await result.json()));
}
