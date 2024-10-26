import type { Post } from '$lib/models/Post.js';
import { db } from '$lib/scripts/firebase.js';
import { get, ref } from 'firebase/database';

export async function load({ params }) {
	return {
		post: await new Promise(res => {
			get(ref(db, `/posts/${params.uid}`)).then(s => {
				if (s.exists()) res(s.val());
			});
		}) as Post
	};
}
