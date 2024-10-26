export async function load({ fetch }) {
	let tags = await (await fetch('/api/tags')).json();
	return {
		tags: tags
	};
}
