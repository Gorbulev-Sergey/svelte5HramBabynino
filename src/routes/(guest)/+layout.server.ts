import type { Post } from '$lib/models/Post';
import type { Tag } from '$lib/models/Tag';

export async function load({ fetch }) {
	let posts = async (): Promise<[string, Post][]> => await (await fetch('/api/posts')).json();
	let tags = async (): Promise<Tag[]> => await (await fetch('/api/tags')).json();
	return {
		posts: Object.entries(await posts()),
		tags: await tags()
	};
}
