import type { Post } from '$lib/models/Post';
import type { Tag } from '$lib/models/Tag';

export async function load({ fetch }) {
	let posts = async (): Promise<[string, Post][]> => await fetch('/api/posts').then(v => v.json());
	let tags = async (): Promise<Tag[]> => await fetch('/api/tags').then(v => v.json());
	return {
		posts: Object.entries(await posts()),
		tags: await tags()
	};
}
