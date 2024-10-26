import type { Post } from "$lib/models/Post";

export async function load({ fetch, params }) {
    let data = await fetch('/api/posts');
    let posts = await data.json();
    return {
        description: params.tag[0].toUpperCase() + params.tag.slice(1),
        posts: Object.entries(posts) as [string, Post][]
    }
}