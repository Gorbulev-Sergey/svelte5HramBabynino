export async function load({ params, fetch }) {
	return {
		post: await fetch(`/api/posts/${params.uid}`).then(v => v.json())
	};
}
