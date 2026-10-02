// Прокси для файлов Firebase Storage: браузер получает файл с домена сайта,
// а сервер сайта сам скачивает его из Firebase (см. $lib/settings/proxyStorage)
export async function GET({ url }) {
	// Берём исходный (незакодированный повторно) путь, чтобы сохранить %2F в имени файла
	const path = url.pathname.replace(/^\/firebase-storage\//, '');
	const response = await fetch(`https://firebasestorage.googleapis.com/${path}${url.search}`);
	if (!response.ok) return new Response(null, { status: response.status });
	return new Response(response.body, {
		headers: {
			'content-type': response.headers.get('content-type') ?? 'application/octet-stream',
			'cache-control': 'public, max-age=86400'
		}
	});
}
