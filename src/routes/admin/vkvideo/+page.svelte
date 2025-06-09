<script lang="ts">
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import TagManager from '$lib/components/tags/TagManager.svelte';
	import { Post } from '$lib/models/Post.js';
	import { db } from '$lib/scripts/firebase';
	import { Header } from '$lib/scripts/store';
	import { child, off, push, ref, update } from 'firebase/database';
	import { onDestroy } from 'svelte';

	$Header = header;
	let { data } = $props();
	// Access toket
	let access_token = $state(
		'vk1.a.xm0YSBut11g_tmJiIuGCV635mkYyBT_zGWun5haYma6SXcO92Npisia5FqCCl6FH4tFwvFRp0XLfU7a1YxKeZBQ02fk-cF4ej2GG0MUyY0DXOjc7OSZOzoBQ3mARjnzGa7-XKrSVg22c-JoBiGtaVuyphGEM6JcggO7B1sRLnEDKisNdVhkQRnBMYe8bg707VO2ujGHwyqGqhVLORupnkA'
	);
	// id группы, из которой берутся видео
	let owner_id = $state('');
	// id плейлиста
	let album_id = $state('');
	// Колличество запрашиваемых видео (по умолчанию 100, максимум 200)
	let count = $state(100);
	// Пропустить столько видео при запросе
	let offset = $state(0);
	// Список всех запрошенных видео
	let allVideos = $state([]);
	// Описание для всех видео
	let description = $state('');
	// Список всех доступных тегов
	let allTags = $derived(data.tags);
	// Список прикрепляемых тегов
	let tags = $state([data.tags.find(t => t.name == 'видео')]);
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
					//let posts: Post[] = [];
					// Формируем посты
					allVideos.forEach(v => {
						let postId = push(child(ref(db), '/posts')).key;
						let post: Post = new Post();
						post.title = v.title;
						post.description = description;
						post.cover.video = v.player;
						post.created = new Date(v.date * 1000).toISOString().slice(0, 10);
						post.tags = tags;
						update(ref(db, `/posts/${postId}`), post);
						//posts.push(post);
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
	<div class="d-flex flex-column w-100">
		<div><b>Count</b> (колличество запрашиваемых видео (по умолчанию 100, максимум 200)):</div>
		<input type="number" min="0" class="form-control" bind:value={count} placeholder="count" />
	</div>
	<div class="d-flex flex-column w-100">
		<div><b>Offset</b> (пропустить такое колличество видео при запросе):</div>
		<input type="number" min="0" class="form-control" bind:value={offset} placeholder="offset" />
	</div>
	<button
		class="btn btn-dark text-light"
		onclick={async () => {
			let result = await fetch('/api/vkvideo', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				},
				body: JSON.stringify({
					access_token,
					owner_id,
					album_id,
					count,
					offset
				})
			});
			try {
				allVideos = (await result.json()).response.items;
				//console.log(allVideos);
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
