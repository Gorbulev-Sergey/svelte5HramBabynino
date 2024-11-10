import { Cover } from '$lib/models/Cover';
import type { Post } from '$lib/models/Post.js';

export async function load({ fetch, params }) {
	let post: Post = await fetch(`/api/posts/${params.uid}`).then(v => v.json());
	if (!post.cover) post.cover = new Cover();
	return {
		post: post
	};
}
