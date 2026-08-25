<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { goto } from '$app/navigation';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import PostHorizontal from '$lib/components/posts/PostHorizontal.svelte';
	import Post from '$lib/components/posts/Post.svelte';
	import { page } from '$app/state';
	import { SETTINGS } from '$lib/settings/settings.svelte.js';

	let { data } = $props();
	let tag = $derived(page.params.tag ?? 'главное');
	let tags = $derived(data.tags);
	let posts = $derived(data.posts.filter(v => v[1].published));
	let postsByTag = $derived(
		posts
			.filter(([k, v]) => v.tags?.some(t => t.name == page.params.tag))
			.sort(([k1, v1], [k2, v2]) => new Date(v2.created).getTime() - new Date(v1.created).getTime())
	);
	let pinnedPosts = $derived(postsByTag.filter(([k, v]) => v.pinned));
	let notPinnedPosts = $derived(postsByTag.filter(([k, v]) => !v.pinned));

	let notPinnedPostsForShow = $derived(notPinnedPosts.slice(0, SETTINGS.posts.showedPosts[tag]));
	let title = $derived(
		data.tags.find(t => t.name.toLocaleLowerCase() == page.params.tag)?.description
	);
	let keywords = $derived(`бабынино, храм, храм бабынино, ${title}`);
</script>

<Container>
	<PageTitle {title} description={title} {keywords} _class="mb-5 position-relative">
		<div class="d-flex flex-wrap justify-content-start justify-content-lg-end gap-1 mt-2">
			{#each tags as item, i}
				<button
					class="badge text-nowrap border-0 {item.name == page.params.tag
						? 'bg-dark text-bg-dark'
						: 'bg-secondary bg-opacity-10 text-bg-light'} "
					onclick={async () => {
						goto(`/posts/${item.name}`);
					}}>{item.name}</button>
			{/each}
		</div>
	</PageTitle>

	<div class="mb-4">
		<!--Для закреплённых-->
		<div>
			{#each pinnedPosts.filter(p => p[1].isHorisontal) as [uid, post], i}
				<PostHorizontal {uid} {post} />
			{/each}
		</div>
		<!--Для закреплённых-->
		<div
			class="row row-cols-1 row-cols-md-2 row-cols-lg-{SETTINGS.posts.columns -
				1} gx-3 gy-5 flex-row-reverse justify-content-center">
			{#each pinnedPosts.filter(p => !p[1].isHorisontal) as [uid, post], i}
				<Post {uid} {post} />
			{/each}
		</div>
	</div>

	<!--Для не закреплённых-->
	<div
		class="row row-cols-1 row-cols-md-2 row-cols-lg-{SETTINGS.posts
			.columns} gx-2 gy-4 justify-content-center">
		{#each notPinnedPostsForShow as [uid, post], i}
			<Post {uid} {post} />
		{/each}
	</div>

	{#if notPinnedPosts.length > notPinnedPostsForShow.length}
		<button
			class="btn btn-light text-dark mt-3 w-100"
			onclick={() => {
				SETTINGS.posts.showedPosts[tag] = SETTINGS.posts.showedPosts[tag] + SETTINGS.posts.step;
			}}>Загрузить ещё...</button>
	{/if}
</Container>

<style>
	.scroll::-webkit-scrollbar {
		height: 0;
	}
</style>
