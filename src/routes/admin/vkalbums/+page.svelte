<script lang="ts">
	import { Photo as _Photo } from '$lib/models/photos/Photo';
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import Photo from '$lib/components/photos/Photo.svelte';
	import { SETTINGS } from '$lib/store/store.svelte';
	import { onMount } from 'svelte';

	let owner_id = $state('-164431454');
	let album_id = $state('');
	let v = $state('5.131');
	let albums = $state([]);
	let photos = $state([]);

	onMount(async () => {
		SETTINGS.Header = header;
	});
</script>

{#snippet header()}
	<PageTitle title="Список фотоальбомов ВК">
		{#if owner_id.trim() != ''}
			<button
				class="btn btn-dark text-light"
				onclick={async () => {
					fetch('/api/vkalbums', {
						method: 'POST',
						headers: {
							'Content-type': 'application/json; charset=UTF-8'
						},
						body: JSON.stringify({
							owner_id,
							v
						})
					})
						.then(r => r.json())
						.then(data => {
							if (data.response) {
								albums = data.response.items;
							}
						});
				}}>Запросить</button>
		{/if}
	</PageTitle>
{/snippet}

<div class="d-flex flex-column align-items-start gap-2 mb-4">
	<h5>Начальные данные для доступа к вк</h5>
	<div class="d-flex flex-column w-100">
		<div>
			<b>Access_token</b> (токен доступа, можно получить
			<a href="https://vkhost.github.io/" target="_blank">здесь</a>):
		</div>
		<input class="form-control" bind:value={SETTINGS.vkAccessToken} placeholder="access_token" />
	</div>
	<div class="d-flex flex-column w-100">
		<div><b>Owner_id</b> (id канала вк, с которого берутся видео):</div>
		<input class="form-control" bind:value={owner_id} placeholder="owner_id" />
	</div>
</div>

<div class="d-flex gap-3">
	<div class="w-25">
		<h5>Список фотоальбомов:</h5>
		<div class="d-flex flex-column bg-light">
			{#each albums as item, i}
				<button
					class="btn btn-sm btn-light text-dark rounded-0 text-start"
					onclick={async () => {
						album_id = item.id;
						fetch('/api/vkphotos', {
							method: 'POST',
							headers: {
								'Content-type': 'application/json; charset=UTF-8'
							},
							body: JSON.stringify({
								owner_id,
								album_id,
								v
							})
						})
							.then(r => r.json())
							.then(data => {
								if (data.response) {
									photos = data.response.items;
									console.log(photos);
								}
							});
					}}><b>{i + 1}</b>. {item.title}</button>
			{/each}
		</div>
	</div>
	<div class=" flex-grow-1">
		<h5>Фотографии:</h5>
		<div class="row row-cols-1 row-cols-md-4 g-2">
			{#each photos as item, i}
				<div class="col">
					<div
						class="img-fluid rounded d-flex flex-column"
						style="background-image: url({item.orig_photo
							.url}); background-repeat: no-repeat; background-position: center; background-size: cover; min-height:14em;">
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
