import type { Post } from '$lib/models/Post.js';
import type { Tag } from '$lib/models/Tag.js';

export async function load({ fetch }) {
	let posts = async (): Promise<Post[]> => await fetch('/api/posts').then(v => v.json());
	let tags = async (): Promise<Tag[]> => await fetch('/api/tags').then(v => v.json());
	return {
		posts: await posts(),
		tags: await tags()
	};
}
