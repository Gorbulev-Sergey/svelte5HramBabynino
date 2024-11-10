import type { Tag } from '$lib/models/Tag.js';

export async function load({ fetch }) {
	let tags = async (): Promise<Tag[]> => await fetch('/api/tags').then(v => v.json());
	return {
		tags: await tags()
	};
}
