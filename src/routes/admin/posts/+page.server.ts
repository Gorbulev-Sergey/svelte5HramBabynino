export async function load({ fetch }) {
    let posts = await (await fetch('/api/posts')).json();
    return {
        posts: posts
    };
}
