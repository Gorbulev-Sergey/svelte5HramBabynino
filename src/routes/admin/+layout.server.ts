import type { Album } from '$lib/models/photos/Album.js';
import type { Post } from '$lib/models/Post.js';
import type { Tag } from '$lib/models/Tag.js';

export async function load({ fetch }) {
	let posts = async (): Promise<Post[]> => await fetch('/api/posts').then(v => v.json());
	let tags = async (): Promise<Tag[]> => await fetch('/api/tags').then(v => v.json());
	let albums = async (): Promise<Album[]> => await fetch('/api/photos').then(v => v.json());
	return {
		posts: await posts(),
		tags: await tags(),
		albums: Object.entries(await albums())
	};
}
