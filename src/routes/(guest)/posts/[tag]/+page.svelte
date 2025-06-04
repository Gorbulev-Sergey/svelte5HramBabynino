<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import Post from '$lib/components/posts/Post.svelte';
	import type { Post as _Post } from '$lib/models/Post.js';
	import { showedPostsLength, showedPostsStep } from '$lib/scripts/store';
	import PostHorizontal from '$lib/components/posts/PostHorizontal.svelte';

	let { data } = $props();
	let tags = $derived(data.tags);
	let posts = $derived(data.posts.filter(v => v[1].published));
	let postsByTag = $derived(
		posts
			.filter(([k, v]) => v.tags?.some(t => t.name == $page.params.tag))
			.sort(([k1, v1], [k2, v2]) => new Date(v2.created).getTime() - new Date(v1.created).getTime())
	);
	let pinnedPosts = $derived(postsByTag.filter(([k, v]) => v.pinned));
	let notPinnedPosts = $derived(postsByTag.filter(([k, v]) => !v.pinned));

	let notPinnedPostsForShow = $derived(
		notPinnedPosts.slice(0, $showedPostsLength[$page.params.tag])
	);
	let description = $derived($page.params.tag[0].toUpperCase() + $page.params.tag.slice(1));
	let keywords = $derived(`бабынино, храм, храм бабынино, ${description}`);
</script>

<Container>
	<PageTitle title={description} {description} {keywords} _class="mb-4 position-relative">
		<div slot="navigation" class="d-flex overflow-x-hidden overflow-y-visible h-100 mt-md-0 mt-1">
			<div class="d-flex flex-wrap justify-content-end gap-1 mt-2">
				{#each tags as item, i}
					<button
						class="badge text-nowrap border-0 {item.name == $page.params.tag
							? 'bg-dark text-bg-dark'
							: 'bg-light text-bg-light'} "
						onclick={async () => {
							goto(`/posts/${item.name}`);
						}}>{item.name}</button>
				{/each}
			</div>
		</div>
	</PageTitle>

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
		<div class="row row-cols-1 row-cols-md-3 g-4 flex-row-reverse">
			{#each pinnedPosts.filter(p => !p[1].isHorisontal) as [uid, post], i}
				<Post {uid} {post} />
			{/each}
		</div>
	</div>

	<!--Для не закреплённых-->
	<div class="row row-cols-1 row-cols-md-3 g-4">
		{#each notPinnedPostsForShow as [uid, post], i}
			<Post {uid} {post} />
		{/each}
	</div>

	{#if notPinnedPosts.length > notPinnedPostsForShow.length}
		<button
			class="btn btn-light text-dark mt-3 w-100"
			onclick={() => {
				$showedPostsLength[$page.params.tag] =
					$showedPostsLength[$page.params.tag] + showedPostsStep;
			}}>Загрузить ещё...</button>
	{/if}
</Container>

<style>
	.scroll::-webkit-scrollbar {
		height: 0;
	}
</style>
