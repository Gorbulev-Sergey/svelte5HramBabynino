import type { Post } from '$lib/models/Post.js';
import type { Tag } from '$lib/models/Tag.js';

export async function load({ fetch }) {
	let posts: { [key: string]: Post } = await fetch('/api/posts').then(v => v.json());
	let tags: Tag[] = await fetch('/api/tags').then(v => v.json());
	return {
		posts: Object.entries(posts),
		tags: tags
	};
}
