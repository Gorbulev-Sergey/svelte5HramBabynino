// Firebase Storage может быть недоступен из браузера в некоторых регионах,
// поэтому ссылки на файлы заменяются на путь сайта, который проксируется сервером сайта (см. routes/firebase-storage)
const STORAGE_ORIGIN = 'https://firebasestorage.googleapis.com/';
const PROXY_PATH = '/firebase-storage/';

export function proxyStorageUrls<T>(data: T): T {
	if (data === null || data === undefined) return data;
	return JSON.parse(JSON.stringify(data).replaceAll(STORAGE_ORIGIN, PROXY_PATH));
}
