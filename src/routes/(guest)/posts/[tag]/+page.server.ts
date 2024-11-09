import type { Post } from '$lib/models/Post';

export async function load({ fetch, params }) {
	let posts = async (): Promise<[string, Post][]> => await (await fetch('/api/posts')).json();
	return {
		description: params.tag[0].toUpperCase() + params.tag.slice(1),
		posts: Object.entries(await posts())
	};
}
