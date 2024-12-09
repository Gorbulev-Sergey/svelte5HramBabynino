import type { Album } from '$lib/models/photos/Album.js';
import type { Post } from '$lib/models/Post.js';
import type { Tag } from '$lib/models/Tag.js';

export async function load({ fetch }) {
	let posts: { [key: string]: Post } = await fetch('/api/posts').then(v => v.json());
	let tags: Tag[] = await fetch('/api/tags').then(v => v.json());
	let albums: { [key: string]: Album } = await fetch('/api/photos').then(v => v.json());
	return {
		posts: Object.entries(posts),
		tags: tags,
		albums: Object.entries(albums)
	};
}
