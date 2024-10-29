import type { Tag } from '$lib/models/Tag.js';

export async function load({ fetch }) {
	let tags: Tag[] = await (await fetch('/api/tags')).json();
	return {
		tags: tags
	};
}
