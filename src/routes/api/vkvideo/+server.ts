export async function POST({ request }) {
	let { owner_id, album_id, access_token, offset, count } = await request.json();
	let link = `https://api.vk.com/method/video.get?owner_id=${owner_id}${album_id != '' ? '&album_id=' + album_id : ''}&access_token=${access_token}${Number(offset) > 0 ? '&offset=' + offset : ''}${Number(count) >= 0 ? '&count=' + count : ''}&sort_album=1&v=5.199`;
	let result = await fetch(link, {
		method: 'GET',
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
		}
	});
	return new Response(JSON.stringify(await result.json()));
}
