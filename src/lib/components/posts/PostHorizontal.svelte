<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { type Post } from '$lib/models/Post';
	import { type Snippet } from 'svelte';

	interface IProps {
		uid: string;
		post: Post;
		_class?: string;
		children?: Snippet;
	}

	let { uid = '', post = {} as Post, _class, children }: IProps = $props();
	let showContent = $state(false);
</script>

<div
	id={uid ? uid : ''}
	class="{_class} card rounded-2 mb-3 p-0 {!post.inverted
		? 'bg-light bg-opacity-50 text-dark'
		: 'bg-dark text-light'} border-0">
	<div class="row g-0">
		<div class="{post.cover ? 'col-9' : ''} d-flex flex-column">
			<div class="card-body flex-grow-1 mb-1">
				<div class="d-flex justify-content-between">
					<h5 class="card-title">{@html post.title}</h5>
					{#if post.pinned}
						<i class="fa-solid fa-thumbtack pt-1"></i>
					{/if}
				</div>
				<div class="d-flex justify-content-between align-items-center mb-1">
					<div class="d-flex align-items-center">
						<div class="small text-danger">
							{new Date(post.created).toLocaleDateString('ru-ru', {
								day: 'numeric',
								month: 'long',
								year: 'numeric'
							})}
						</div>
						<!-- {#if post.userName}
							<small>
								<div class="ms-2 badge bg-light bg-opacity-10 text-muted">
									Автор: {post.userName}
								</div>
							</small>
						{/if} -->
					</div>
					<div class="d-flex align-items-center gap-1">
						{#if post.tags}
							{#each post.tags.sort((t1, t2) => t1.name.localeCompare(t2.name)) as tag}
								<button
									class="badge {!post.inverted
										? 'bg-dark bg-opacity-10 text-dark'
										: 'bg-light bg-opacity-10 text-light'} text-decoration-none p-1 border-0"
									onclick={() => goto(`/posts/${tag.name}`)}>{tag.name}</button>
							{/each}
						{/if}
					</div>
				</div>
				<div class="card-text" style="font-size:1em;">
					{#if post.description}
						<div class="py-1" style="font-size:1em;">
							{@html post.description}
						</div>
					{/if}
					{#if post.content}
						<div class="d-flex align-items-center justify-content-end mt-2">
							<button
								class="btn btn-sm {!post.inverted ? 'btn-dark text-light' : 'btn-light text-dark'}"
								onclick={() => {
									if (uid) goto(`/posts/details/${uid}?returnUrl=${$page.url.pathname}`);
								}}><i class="fa-solid fa-circle-arrow-right me-2"></i>Смотреть подробности</button>
						</div>
					{/if}
				</div>
			</div>
			{@render children?.()}
		</div>
		<div class="{post.cover ? 'col-3' : ''} rounded-end overflow-hidden">
			{#if post.cover && post.cover.video}
				<div class="ratio ratio-21x9 h-100">
					{#if post.cover.video.includes('https://youtu.be')}
						<iframe
							title=""
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen
							class="embed-responsive-item"
							src={post.cover.video.replace('https://youtu.be', 'https://youtube.com/embed')}
						></iframe>
					{:else if post.cover.video.includes('https://vk.com/video')}
						<iframe
							title=""
							class="embed-responsive-item"
							src={post.cover.video
								.replace(
									'https://vk.com/video',
									`https://vk.com/video_ext.php?oid=-${post.cover.video?.split('-')[1]?.split('_')[0]}&id=${post.cover.video?.split('-')[1]?.split('_')[1]}&hash=d46c7611ec96988b`
								)
								.replace('-' + post.cover.video?.split('-')[1], '')}></iframe>
					{:else if post.cover.video.includes('https://rutube.ru/video')}
						<iframe
							title=""
							frameBorder="0"
							allow="clipboard-write; autoplay"
							allowFullScreen
							class="embed-responsive-item"
							src={post.cover.video.replace(
								'https://rutube.ru/video/',
								'https://rutube.ru/play/embed/'
							)}></iframe>
					{/if}
				</div>
			{:else if post.cover && post.cover.image}
				<div
					class="img-fluid rounded-end h-100"
					style="background-image: url({post.cover.image});
					 background-repeat: no-repeat; background-position: center; background-size: cover; min-height:12em;">
				</div>
			{/if}
		</div>
	</div>
</div>
