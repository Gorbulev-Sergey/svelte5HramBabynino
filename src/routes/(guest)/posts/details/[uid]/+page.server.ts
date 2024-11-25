import type { IPost } from '$lib/models/Post.js';

export async function load({ params, fetch }) {
	return {
		post: (await fetch(`/api/posts/${params.uid}`).then(v => v.json())) as IPost
	};
}
