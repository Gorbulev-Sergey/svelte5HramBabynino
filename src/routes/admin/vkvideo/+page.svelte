<script lang="ts">
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import TagManager from '$lib/components/tags/TagManager.svelte';
	import { Post, type IPost } from '$lib/models/Post.js';
	import { type ITag, Tag as _Tag } from '$lib/models/Tag';
	import { db } from '$lib/scripts/firebase';
	import { SETTINGS } from '$lib/store/store.svelte.js';
	import { child, off, onValue, push, ref, update } from 'firebase/database';
	import { onMount } from 'svelte';

	// Access toket
	let access_token = $state(SETTINGS.vkAccessToken);
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
	let allTags: ITag[] = $state([]);
	// Список прикрепляемых тегов
	let tags = $state([_Tag('видео', 'Видео')]);

	onMount(async () => {
		SETTINGS.Header = header;
		onValue(ref(db, '/tags'), s => {
			if (s.exists()) {
				allTags = Object.values(s.val());
			}
		});
	});
</script>

{#snippet header()}
	<PageTitle title="ВК видео (загрузка видео из вк)">
		{#if allVideos.length > 0}
			<button
				class="btn btn-dark text-light"
				onclick={async () => {
					// Формируем посты
					allVideos.forEach(v => {
						let postId = push(child(ref(db), '/posts')).key;
						let post: IPost = Post();
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
				}}>Загрузить видео в базу данных сайта</button>
		{/if}
	</PageTitle>
{/snippet}

<div class="d-flex flex-column align-items-start gap-2 text-dark">
	<h5 class="text-dark">Начальные данные для доступа к видео на сайте вк</h5>
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
			} catch (error) {}
		}}>Запросить видео</button>
</div>

{#if allVideos.length > 0}
	<div class="mt-5 text-dark">
		<h5>Строка описания для всех видео</h5>
		<textarea class="form-control" bind:value={description}></textarea>
	</div>
{/if}

{#if allVideos.length > 0}
	<div class="mt-5 text-dark">
		<h5>Теги, которые добавляются ко всем видео</h5>
		<TagManager tags={allTags} selectedTag={_Tag()} bind:selectedTags={tags} />
	</div>
{/if}

{#if allVideos.length > 0}
	<div class="mt-5 text-dark">
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
