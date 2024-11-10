import type { Post } from '$lib/models/Post.js';

export async function load({ fetch, params }) {
	let post = async (): Promise<Post> => await fetch(`/api/posts/${params.uid}`).then(v => v.json());
	return {
		post: await post()
	};
}
