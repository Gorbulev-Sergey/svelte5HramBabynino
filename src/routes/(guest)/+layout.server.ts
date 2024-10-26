import type { Tag } from '$lib/models/Tag';

export async function load({ fetch }) {
	let response = await fetch('/api/tags');
	let tags = await response.json();
	return {
		tags: tags as Tag[]
	};
}
