<script lang="ts">
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import TagManager from '$lib/components/tags/TagManager.svelte';
	import { Post } from '$lib/models/Post.js';
	import { db } from '$lib/scripts/firebase';
	import { Header } from '$lib/scripts/store';
	import { child, push, ref, update } from 'firebase/database';
	import { onDestroy } from 'svelte';

	$Header = header;
	let { data } = $props();
	// Access toket
	let access_token = $state(
		'vk1.a.5iNLx-ZwQO96HxS-gjPg6PjQ3WxuXlzNTrUZuTAjD3eavzobdKErygz_7glHpQ6q-WOmaOTYXygoJMiwlGDWUz7WhLA8eLOJTffiaJP0OKdGQgQ-T8ZnOAxSka2RJ5vYrfmZOBPD7lfsazN5X6rtqi7BGPPvgZzN-MoKGicnUfJGOCVTHBgQschpNYGE0mfQ_uY5lgKFpmo4QtAABbIDWw'
	);
	// id группы, из которой берутся видео
	let owner_id = $state('');
	// id плейлиста
	let album_id = $state('');
	// Список всех запрошенных видео
	let allVideos = $state([]);
	// Описание для всех видео
	let description = $state('');
	// Список всех доступных тегов
	let allTags = $derived(data.tags);
	// Список прикрепляемых тегов
	let tags = $state([]);
	onDestroy(() => ($Header = null));
</script>

{#snippet header()}
	<PageTitle title="ВК видео (загрузка видео из вк)">
		{#if allVideos.length <= 0}
			<button class="btn btn-dark text-light" disabled>Загрузить видео на наш сайт</button>
		{:else}
			<button
				class="btn btn-dark text-light"
				onclick={async () => {
					// Формируем посты
					allVideos.forEach(v => {
						let postId = push(child(ref(db), '/posts')).key;
						let post: Post = new Post();
						post.title = v.title;
						post.description = description;
						post.cover.video = v.player;
						post.tags = tags;
						update(ref(db, `/posts/${postId}`), post);
					});
					//console.log(posts);
					allVideos = [];
				}}>Загрузить видео на наш сайт</button>
		{/if}
	</PageTitle>
{/snippet}

<div class="d-flex flex-column align-items-start gap-2">
	<h5>Начальные данные для доступа к видео на сайте вк</h5>
	<div class="d-flex flex-column w-100">
		<div>
			<b>Access_token</b> (токен доступа, можно получить
			<a href="https://vkhost.github.io/" target="_blank">здесь</a>):
		</div>
		<input class="form-control" bind:value={access_token} placeholder="access_token" />
	</div>
	<div class="d-flex flex-column w-100">
		<div><b>Owner_id</b> (id канала вк, с которого берутся видео):</div>
		<input class="form-control" bind:value={owner_id} placeholder="owner_id" />
	</div>
	<div class="d-flex flex-column w-100">
		<div><b>Album_id</b> (id плейлиста):</div>
		<input class="form-control" bind:value={album_id} placeholder="album_id" />
	</div>
	<button
		class="btn btn-dark text-light"
		onclick={async () => {
			let result = await fetch('/api/vkvideo', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				},
				body: JSON.stringify({ access_token: access_token, owner_id: owner_id, album_id: album_id })
			});
			try {
				allVideos = (await result.json()).response.items;
				console.log(allVideos);
			} catch (error) {}
		}}>Запросить видео</button>
</div>

{#if allVideos.length > 0}
	<div class="mt-5">
		<h5>Строка описания для всех видео</h5>
		<textarea class="form-control" bind:value={description}></textarea>
	</div>
{/if}

{#if allVideos.length > 0}
	<div class="mt-5">
		<h5>Теги, которые добавляются ко всем видео</h5>
		<TagManager tags={allTags} bind:selectedTags={tags} />
	</div>
{/if}

{#if allVideos.length > 0}
	<div class="mt-5">
		<h5>Список полученных видео ({allVideos.length} видео)</h5>
		<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-2">
			{#each allVideos as item}
				{#if item.player.includes('https://vk.com/video_ext.php')}
					<div class="col">
						<div class="ratio ratio-16x9 rounded">
							<iframe
								class="rounded"
								title={item.title}
								src={item.player}
								frameborder="0"
								allowfullscreen
								allow="autoplay; encrypted-media; fullscreen; picture-in-picture"></iframe>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
{/if}
