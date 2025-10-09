import type { IPost } from '$lib/models/Post.js';
import type { ITag } from '$lib/models/Tag.js';

export async function load({ fetch }) {
	let posts: { [key: string]: IPost } = await fetch('/api/posts').then(v => v.json());
	let tags: ITag[] = await fetch('/api/tags').then(v => v.json());
	return {
		posts: Object.entries(posts),
		tags: tags
	};
}
