export async function POST({ request }) {
	let { owner_id, album_id, access_token } = await request.json();
	let link = `https://api.vk.com/method/video.get?owner_id=${owner_id}&album_id=${album_id}&access_token=${access_token}&v=5.199`;
	let result = await fetch(link, {
		method: 'GET',
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
		}
	});
	return new Response(JSON.stringify(await result.json()));
}
