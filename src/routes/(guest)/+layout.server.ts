import type { Tag } from '$lib/models/Tag';

export async function load({ fetch }) {
	let tags = async (): Promise<Tag[]> => await (await fetch('/api/tags')).json();
	return {
		tags: await tags()
	};
}
