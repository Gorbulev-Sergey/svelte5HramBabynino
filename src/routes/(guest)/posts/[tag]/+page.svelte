<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import Post from '$lib/components/posts/Post.svelte';
	import type { Post as _Post } from '$lib/models/Post.js';
	import Spinner from '$lib/components/Spinner.svelte';
	import { showedPostsLength, showedPostsStep } from '$lib/scripts/writableData.js';
	import PostHorizontal from '$lib/components/posts/PostHorizontal.svelte';
	import type { Tag } from '$lib/models/Tag.js';
	import { onMount } from 'svelte';
	import { onValue, ref } from 'firebase/database';
	import { db } from '$lib/scripts/firebase.js';

	export let data;
	$: tags = data.tags as Tag[];
	$: posts = data.posts.filter(([k, v]) => v.published);
	$: postsByTag = posts.filter(([k, v]) => v.tags?.some(t => t.name === $page.params.tag)).sort(([k1, v1], [k2, v2]) => new Date(v2.created).getTime() - new Date(v1.created).getTime());
	$: pinnedPosts = postsByTag.filter(([k, v]) => v.pinned);
	$: notPinnedPosts = postsByTag.filter(([k, v]) => !v.pinned);
	$: notPinnedPostsForShow = notPinnedPosts.slice(0, $showedPostsLength.get($page.params.tag));

	$: description = data.description;
	$: keywords = `бабынино, храм, храм бабынино, ${description}`;
</script>

<Container>
	<PageTitle title={description} {description} {keywords} _class="mb-4 position-relative">
		<div slot="navigation" class="d-flex overflow-x-hidden overflow-y-visible h-100 mt-md-0 mt-1">
			<div class="btn-group btn-group-sm scroll overflow-scroll bg-light pe-1">
				{#each tags as item, i}
					<button
						class="btn text-nowrap {item.name == $page.params.tag ? 'btn-dark text-light' : 'btn-light text-dark'} 
						{tags.length == i + 1 ? 'rounded-end-0' : ''}"
						on:click={async () => {
							goto(`/posts/${item.name}`);
						}}>{item.name}</button>
				{/each}
			</div>
			<div class="dropdown position-absolute end-0" style="z-index:1000">
				<button class="btn btn-sm btn-light text-dark rounded-start-0" data-bs-toggle="dropdown">
					<i class="fa-solid fa-ellipsis-vertical"></i>
				</button>
				<div class="dropdown-menu bg-light py-1 border-light shadow-sm rounded-1">
					{#each tags as item}
						<button
							class="btn btn-sm text-nowrap w-100 rounded-0 text-start ps-2 {item.name == $page.params.tag ? 'btn-dark text-light' : 'btn-light text-dark'}"
							on:click={async () => {
								goto(`/posts/${item.name}`);
							}}>{item.name}</button>
					{/each}
				</div>
			</div>
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
			on:click={() => {
				$showedPostsLength.set($page.params.tag, $showedPostsLength.get($page.params.tag) + showedPostsStep);
				notPinnedPostsForShow = notPinnedPosts.slice(0, $showedPostsLength.get($page.params.tag));
			}}>Загрузить ещё...</button>
	{/if}
</Container>

<style>
	.scroll::-webkit-scrollbar {
		height: 0;
	}
</style>
