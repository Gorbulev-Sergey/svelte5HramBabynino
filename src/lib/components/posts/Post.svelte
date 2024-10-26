<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Post } from '$lib/models/Post';

	export let uid = '';
	export let post = new Post();
	export let _class = '';
	let showContent = false;
</script>

<div class="col" id={uid ? uid : ''}>
	<div
		class="d-flex flex-column gap-3 rounded-2 {!post.inverted ? 'bg-light bg-opacity-50 text-dark' : 'bg-dark text-light'} {post.isHeightAuto == true || post.isHeightAuto == null
			? 'h-100'
			: ''} {_class}">
		<div class="flex-grow-1 px-3 pt-2">
			<div class="d-flex justify-content-between align-items-center mb-2">
				<div class="small text-danger">
					{new Date(post.created).toLocaleDateString('ru-ru', { day: 'numeric', month: 'long', year: 'numeric' })}
				</div>
				<div class="d-flex align-items-center gap-1">
					{#if post.tags}
						{#each post.tags.sort((t1, t2) => t1.name.localeCompare(t2.name)) as tag}
							<button
								class="badge {!post.inverted ? 'bg-dark bg-opacity-10 text-dark' : 'bg-light bg-opacity-10 text-light'} text-decoration-none p-1 border-0"
								on:click={() => {
									goto(`/posts/${tag.name}`);
								}}>{tag.name}</button>
						{/each}
					{/if}
				</div>
			</div>
			<div class="d-flex justify-content-between">
				<h5 class="card-title">{@html post.title}</h5>
				{#if post.pinned}
					<i class="fa-solid fa-thumbtack pt-1" />
				{/if}
			</div>
		</div>
		{#if post.description}
			<div class="px-3 {!post.cover || post.content == '' ? 'mb-3' : ''}">
				{@html post.description}
				<slot name="admin" />
			</div>
		{/if}
		{#if post.cover && post.cover.video}
			<div class="ratio ratio-21x9" style="min-height:12em;">
				<!-- svelte-ignore a11y-missing-attribute -->
				{#if post.cover.video.includes('https://youtu.be')}
					<iframe
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
						allowfullscreen
						class="embed-responsive-item"
						style={!post.content ? 'border-radius: 0 0 .4rem .4rem' : ''}
						src={post.cover.video.replace('https://youtu.be', 'https://youtube.com/embed')} />
				{:else if post.cover.video.includes('https://vk.com/video')}
					<iframe
						class="embed-responsive-item"
						style={!post.content ? 'border-radius: 0 0 .4rem .4rem' : ''}
						src={post.cover.video
							.replace(
								'https://vk.com/video',
								`https://vk.com/video_ext.php?oid=-${post.cover.video?.split('-')[1]?.split('_')[0]}&id=${post.cover.video?.split('-')[1]?.split('_')[1]}&hash=d46c7611ec96988b`
							)
							.replace('-' + post.cover.video?.split('-')[1], '')} />
				{:else if post.cover.video.includes('https://rutube.ru/video')}
					<iframe
						frameBorder="0"
						allow="clipboard-write; autoplay"
						allowFullScreen
						class="embed-responsive-item"
						style={!post.content ? 'border-radius: 0 0 .4rem .4rem' : ''}
						src={post.cover.video.replace('https://rutube.ru/video/', 'https://rutube.ru/play/embed/')} />
				{/if}
			</div>
		{:else if post.cover && post.cover.image}
			{#if !post.isImageHeightFull}
				<div
					class="img-fluid"
					style="background-image: url({post.cover.image});
					 background-repeat: no-repeat; background-position: center; background-size: cover; min-height:12em ;
					 {!post.content ? 'border-radius: 0 0 .4rem .4rem' : ''}" />
			{:else}
				<img class="img-fluid" style="border-radius: 0 0 .4rem .4rem" src={post.cover.image} alt="" />
			{/if}
		{/if}
		{#if post.content}
			<div class="d-flex align-items-center justify-content-end m-3 mt-0">
				<button
					class="btn btn-sm {!post.inverted ? 'btn-dark text-light' : 'btn-light text-dark'}"
					on:click={() => {
						if (uid) goto(`/posts/details/${uid}?returnUrl=${$page.url.pathname}`);
					}}><i class="fa-solid fa-circle-arrow-right me-2" />Смотреть подробности</button>
			</div>
		{/if}
	</div>
</div>
