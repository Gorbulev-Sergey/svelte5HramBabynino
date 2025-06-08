<script lang="ts">
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import { db } from '$lib/scripts/firebase';
	import { alerts, Header } from '$lib/scripts/store';
	import { push, ref, update } from 'firebase/database';
	import { onDestroy } from 'svelte';

	$Header = header;
	// Access toket
	let access_token = $state(
		'vk1.a.5iNLx-ZwQO96HxS-gjPg6PjQ3WxuXlzNTrUZuTAjD3eavzobdKErygz_7glHpQ6q-WOmaOTYXygoJMiwlGDWUz7WhLA8eLOJTffiaJP0OKdGQgQ-T8ZnOAxSka2RJ5vYrfmZOBPD7lfsazN5X6rtqi7BGPPvgZzN-MoKGicnUfJGOCVTHBgQschpNYGE0mfQ_uY5lgKFpmo4QtAABbIDWw'
	);
	// id группы, из которой берутся видео
	let owner_id = $state('-39975299');
	// id плейлиста
	let album_id = $state('55923177');
	// Список всех запрошенных видео
	let allVideos = $state([]);
	onDestroy(() => ($Header = null));
</script>

{#snippet header()}
	<PageTitle title="ВК видео (загрузка видео из вк)">
		<button class="btn btn-dark text-light">Загрузить видео на сайт</button>
	</PageTitle>
{/snippet}

<div class="d-flex flex-column align-items-start gap-2">
	<h5>Начальные данные для доступа к видео на сайте вк</h5>
	<input class="form-control" bind:value={access_token} placeholder="access_token" />
	<input class="form-control" bind:value={owner_id} placeholder="owner_id" />
	<input class="form-control" bind:value={album_id} placeholder="album_id" />
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
