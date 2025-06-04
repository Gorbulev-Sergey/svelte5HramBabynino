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
			<div class="btn-group btn-group-sm scroll overflow-scroll bg-light pe-1">
				{#each tags as item, i}
					<button
						class="btn text-nowrap {item.name == $page.params.tag
							? 'btn-dark text-light'
							: 'btn-light text-dark'} 
						{tags.length == i + 1 ? 'rounded-end-0' : ''}"
						onclick={async () => {
							goto(`/posts/${item.name}`);
						}}>{item.name}</button>
				{/each}
			</div>
			<div class="dropdown position-absolute end-0" style="z-index:1000">
				<button
					aria-label=""
					class="btn btn-sm btn-light text-dark rounded-start-0"
					data-bs-toggle="dropdown">
					<i class="fa-solid fa-ellipsis-vertical"></i>
				</button>
				<div class="dropdown-menu bg-light py-1 border-light shadow-sm rounded-1">
					{#each tags as item}
						<button
							class="btn btn-sm text-nowrap w-100 rounded-0 text-start ps-2 {item.name ==
							$page.params.tag
								? 'btn-dark text-light'
								: 'btn-light text-dark'}"
							onclick={async () => {
								goto(`/posts/${item.name}`);
							}}>{item.name}</button>
					{/each}
				</div>
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
