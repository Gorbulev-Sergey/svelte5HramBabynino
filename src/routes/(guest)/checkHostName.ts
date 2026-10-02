export let isHostEnabled = (request: Request) => {
	let hostname = new URL(request.url).hostname;
	return hostname == 'localhost' ||
		hostname == 'hram-babynino.ru' ||
		hostname == 'hram-babynino.netlify.app' ||
		hostname == 'hram-babynino.vercel.app' ||
		hostname.endsWith('--hram-babynino.netlify.app')
		? true
		: false;
};

export let checkHost = (request: Request, responseBody: any) => {
	if (isHostEnabled(request)) {
		return new Response(JSON.stringify(responseBody));
	} else {
		return new Response(JSON.stringify({}));
	}
};
