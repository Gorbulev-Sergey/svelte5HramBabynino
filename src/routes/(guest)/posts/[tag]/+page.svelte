<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { goto } from '$app/navigation';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import PostHorizontal from '$lib/components/posts/PostHorizontal.svelte';
	import Post from '$lib/components/posts/Post.svelte';
	import { page } from '$app/state';
	import { SETTINGS } from '$lib/settings/settings.svelte.js';

	let { data } = $props();
	let tags = $derived(data.tags);
	let posts = $derived(data.posts.filter(v => v[1].published));
	let postsByTag = $derived(
		posts
			.filter(([k, v]) => v.tags?.some(t => t.name == page.params.tag))
			.sort(([k1, v1], [k2, v2]) => new Date(v2.created).getTime() - new Date(v1.created).getTime())
	);
	let pinnedPosts = $derived(postsByTag.filter(([k, v]) => v.pinned));
	let notPinnedPosts = $derived(postsByTag.filter(([k, v]) => !v.pinned));

	let notPinnedPostsForShow = $derived(
		notPinnedPosts.slice(0, SETTINGS.posts.showedMap[page.params.tag])
	);
	let description = $derived(page.params.tag[0].toUpperCase() + page.params.tag.slice(1));
	let keywords = $derived(`бабынино, храм, храм бабынино, ${description}`);
</script>

<Container>
	<PageTitle title={description} {description} {keywords} _class="mb-4 position-relative">
		<div slot="navigation" class="">
			<div class="d-flex flex-wrap justify-content-start justify-content-lg-end gap-1 mt-2">
				{#each tags as item, i}
					<button
						class="badge text-nowrap border-0 {item.name == page.params.tag
							? 'bg-dark text-bg-dark'
							: 'bg-light text-bg-light'} "
						onclick={async () => {
							goto(`/posts/${item.name}`);
						}}>{item.name}</button>
				{/each}
			</div>
		</div></PageTitle>

	<!-- <div class="alert alert-info border-0 text-center">
		Дорогие посетители! В связи с ограничениями, наложенными на Youtube в нашей стране, некоторые
		видео на нашем сайте будут работать неккоректно! Приносим свои извинения!
	</div> -->

	<div class="mb-4">
		<!--Для закреплённых-->
		<div>
			{#each pinnedPosts.filter(p => p[1].isHorisontal) as [uid, post], i}
				<PostHorizontal {uid} {post} />
			{/each}
		</div>
		<!--Для закреплённых-->
		<div
			class="row row-cols-1 row-cols-md-2 row-cols-lg-{SETTINGS.posts
				.columns} g-4 flex-row-reverse justify-content-center">
			{#each pinnedPosts.filter(p => !p[1].isHorisontal) as [uid, post], i}
				<Post {uid} {post} />
			{/each}
		</div>
	</div>

	<!--Для не закреплённых-->
	<div
		class="row row-cols-1 row-cols-md-2 row-cols-lg-{SETTINGS.posts
			.columns} g-4 justify-content-center">
		{#each notPinnedPostsForShow as [uid, post], i}
			<Post {uid} {post} />
		{/each}
	</div>

	{#if notPinnedPosts.length > notPinnedPostsForShow.length}
		<button
			class="btn btn-light text-dark mt-3 w-100"
			onclick={() => {
				SETTINGS.posts.showedMap[page.params.tag] =
					SETTINGS.posts.showedMap[page.params.tag] + SETTINGS.posts.step;
			}}>Загрузить ещё...</button>
	{/if}
</Container>

<style>
	.scroll::-webkit-scrollbar {
		height: 0;
	}
</style>
