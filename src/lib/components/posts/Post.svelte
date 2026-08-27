<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Post, type IPost } from '$lib/models/Post';
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		uid?: string;
		post?: IPost;
		_class?: string;
		style?: string;
		children?: Snippet;
		isTagsShow?: boolean;
		subtitle?: Snippet;
	}
	let {
		uid = '',
		post = Post(),
		style = '',
		_class = '',
		children,
		isTagsShow = true,
		subtitle
	}: Props = $props();

	let postColors = $derived(
		post.inverted
			? 'bg-dark text-light p-2'
			: post.background
				? `bg-${post.background} bg-opacity-25 text-dark p-2`
				: 'bg-light bg-opacity-50 text-dark'
	);

	let isTagMenuShow = $state(false);
</script>

<div transition:slide class="col" id={uid ? uid : ''}>
	<div
		class="d-flex flex-column gap-2 rounded rounded-1 {postColors} {post.isHeightAuto == true ||
		post.isHeightAuto == null
			? 'h-100'
			: ''} {_class}"
		{style}>
		<div class="flex-grow-1 d-flex flex-column gap-1">
			<div class="d-flex flex-column justify-content-between gap-2 ps-1">
				<div class="d-flex align-items-center justify-content-between">
					<div class="d-flex flex-grow-1 align-items-center gap-1">
						{#if post.pinned}
							<small class="overflow-hidden">
								<i class="fa-solid fa-thumbtack" style="transform: rotate(45deg);"></i>
							</small>
						{/if}
						<div class="small text-danger text-nowrap">
							{new Date(post.created).toLocaleDateString('ru-ru', {
								day: 'numeric',
								month: 'long',
								year: 'numeric'
							})}
						</div>
						<div>{@render subtitle?.()}</div>
					</div>
					<div class="my-dropdown z-1 text-nowrap">
						<div class="my-dropdown-main-btn bottom-100">
							<div class="align-items-center gap-1" title="Хэштеги">
								{#each new Array(3) as _, i}
									<button
										style="font-size: .7em; right:{i / 8}rem; z-index: {-i}"
										class="badge p-1 me-1 position-absolute border {!post.inverted
											? 'bg-light text-dark'
											: 'bg-dark text-light'} text-decoration-none p-1"
										onclick={() => {}}>#{post.tags.length}</button>
								{/each}
							</div>
						</div>
						<div
							class="my-dropdown-content py-1 me-1 rounded rounded-1 border bg-light"
							style="margin-top: 1.3rem;">
							{#each post.tags as tag, i}
								<button
									class="btn btn-sm btn-light text-dark rounded-0 border-0 text-start"
									onclick={() => {
										goto(`/posts/${tag.name}`);
									}}>#{tag.name}</button>
							{/each}
						</div>
					</div>
				</div>
			</div>

			{#if children}
				<div class="mb-2">
					<!--style="margin-left: -.25em; margin-right:-.5em" -->
					{@render children?.()}
				</div>
			{/if}

			{#if post.cover && post.cover.video}
				<div class="ratio ratio-21x9" style="min-height:12em;">
					{#if post.cover.video.includes('https://youtu.be')}
						<!-- svelte-ignore a11y_missing_attribute -->
						<iframe
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
							allowfullscreen
							class="embed-responsive-item rounded rounded-1"
							src={post.cover.video.replace('https://youtu.be', 'https://youtube.com/embed')}
						></iframe>
					{:else if post.cover.video.includes('https://vkvideo.ru/video')}
						<iframe
							title=""
							frameborder="0"
							allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
							class="embed-responsive-item rounded rounded-1"
							src={post.cover.video
								.replace(
									'https://vkvideo.ru/video',
									`https://vkvideo.ru/video_ext.php?oid=-${post.cover.video?.split('-')[1]?.split('_')[0]}&id=${post.cover.video?.split('-')[1]?.split('_')[1]}`
								)
								.replace('-' + post.cover.video?.split('-')[1], '')}></iframe>
					{:else if post.cover.video.includes('https://vk.com/video_ext.php')}
						<iframe
							title=""
							frameborder="0"
							allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
							class="embed-responsive-item rounded rounded-1"
							src={post.cover.video}></iframe>
					{:else if post.cover.video.includes('https://rutube.ru/video')}
						<!-- svelte-ignore a11y_missing_attribute -->
						<iframe
							frameBorder="0"
							allow="clipboard-write; autoplay"
							allowFullScreen
							class="embed-responsive-item rounded rounded-1"
							src={post.cover.video.replace(
								'https://rutube.ru/video/',
								'https://rutube.ru/play/embed/'
							)}></iframe>
					{/if}
				</div>
			{:else if post.cover && post.cover?.image}
				{#if !post.isImageHeightFull}
					<div
						class="img-fluid rounded"
						style="background-image: url({post.cover?.image});
					 background-repeat: no-repeat; background-position: center; background-size: cover; min-height:12em ;					 ">
					</div>
				{:else}
					<img class="img-fluid rounded" src={post.cover?.image} alt="" />
				{/if}
			{/if}

			<div class="d-flex flex-column gap-0 px-1 pt-1">
				<div class="d-flex align-self-center justify-content-between w-100">
					<b class="text-uppercase">{@html post.title}</b>
				</div>

				{#if post.description}
					<div class="{!post.cover || post.content == '' ? 'mb-3' : ''} text-opacity-50">
						{@html post.description}
					</div>
				{/if}

				{#if post.content}
					<div class="d-flex align-items-center my-1">
						<button
							class="btn btn-sm {!post.inverted ? 'btn-dark text-light' : 'btn-light text-dark'}"
							onclick={() => {
								if (uid) goto(`/posts/details/${uid}?returnUrl=${$page.url.pathname}`);
							}}>Подробнее...</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.my-dropdown {
		position: relative;
		display: inline-flex;
		top: -50%;
	}

	.my-dropdown-main-btn {
		position: absolute;
	}

	/* Скрытое меню */
	.my-dropdown-content {
		display: none; /* скрыто по умолчанию */
		position: absolute;
		right: 0;
		z-index: 10;
	}

	/* Показать меню при наведении на контейнер */
	.my-dropdown:hover .my-dropdown-content {
		display: flex;
		flex-direction: column;
	}
</style>
