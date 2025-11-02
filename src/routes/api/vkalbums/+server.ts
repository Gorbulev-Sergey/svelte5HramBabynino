import { SETTINGS } from '$lib/settings/settings.svelte';
import { isHostEnabled } from '../../(guest)/checkHostName.js';

export async function POST({ request }) {
	if (isHostEnabled(request)) {
		let { owner_id, v } = await request.json();
		let link = `https://api.vk.com/method/photos.getAlbums?owner_id=${owner_id}&access_token=${SETTINGS.ADMIN.vk.accessToken}&v=${v}`;
		let result = await fetch(link, {
			method: 'GET',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		});
		return new Response(JSON.stringify(await result.json()));
	} else return new Response(JSON.stringify(''));
}
