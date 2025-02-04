import { Post, type IPost } from '$lib/models/Post.js';

export async function load({ fetch, params }) {
	let post = async (): Promise<IPost> =>
		await fetch(`/api/posts/${params.uid}`).then(v => v.json());
	return {
		post: { ...Post(), ...(await post()) }
	};
}
