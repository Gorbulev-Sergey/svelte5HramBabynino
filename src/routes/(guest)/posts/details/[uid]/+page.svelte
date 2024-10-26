<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Container from '$lib/components/Container.svelte';
	import { Post as _Post } from '$lib/models/Post';

	export let data;
	let post = data.post;
</script>

<svelte:head>
	{#if post.title}
		<title>{post.title}</title>
	{/if}
</svelte:head>

<Container>
	{#if post.title}
		<button class="btn btn-dark text-light text-nowrap" on:click={() => goto(`${$page.url.searchParams.get('returnUrl')}/#${$page.params.uid}`)}
			><i class="fa-solid fa-circle-arrow-left me-2" />Вернуться назад</button>

		<div class="bg-white text-dark rounded mt-3">
			<div
				class="d-flex flex-column justify-content-end rounded-top rounded-3"
				style="background-image: url({post.cover?.image ? post.cover.image : ''});
					 background-repeat: no-repeat; background-position: center; background-size: cover; min-height:18em;">
				<div class="d-flex justify-content-between align-items-end bg-light bg-opacity-50 text-dark px-4 py-3">
					<div class="me-4">
						<h4 class="mb-0 pb-0">{@html post.title}</h4>
						{#if post.description}
							<div class="mt-1 small">{@html post.description}</div>
						{/if}
					</div>
					<div class="text-end">
						<div class="small text-danger text-nowrap">
							{new Date(post.created).toLocaleDateString('ru-ru', { day: 'numeric', month: 'long', year: 'numeric' })}
						</div>
					</div>
				</div>
			</div>
			<div class="p-4">
				{@html post.content}
			</div>
		</div>

		<button class="btn btn-dark text-light" on:click={() => goto(`${$page.url.searchParams.get('returnUrl')}/#${$page.params.uid}`)}
			><i class="fa-solid fa-circle-arrow-left me-2" />Вернуться назад</button>
	{/if}
</Container>
