import type { Post } from '$lib/models/Post.js';

export async function load({ fetch }) {
	let posts: Post[] = await fetch('/api/posts').then(v => v.json());
	return {
		posts: posts
	};
}
