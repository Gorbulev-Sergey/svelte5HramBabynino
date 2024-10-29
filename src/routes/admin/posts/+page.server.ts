import type { Post } from '$lib/models/Post.js';

export async function load({ fetch }) {
	let posts: Post[] = await (await fetch('/api/posts')).json();
	return {
		posts: posts
	};
}
