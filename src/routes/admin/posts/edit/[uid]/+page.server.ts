import { Cover } from '$lib/models/Cover';
import type { Post } from '$lib/models/Post.js';

export async function load({ fetch, params }) {
	let response = await fetch(`/api/posts/${params.uid}`);
	let post: Post = await response.json();
	if (!post.cover) post.cover = new Cover();
	return {
		post: post
	};
}
