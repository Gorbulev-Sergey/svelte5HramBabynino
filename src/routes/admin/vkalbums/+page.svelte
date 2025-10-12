<script lang="ts">
	import { Photo as _Photo } from '$lib/models/photos/Photo';
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import { SETTINGS } from '$lib/store/store.svelte';
	import { onMount } from 'svelte';
	import Modal from '$lib/components/Modal.svelte';

	interface IVkAlbum {
		id: string;
		title: string;
	}
	interface IVkPhoto {
		text: string;
		orig_photo: IOrig_photo;
	}
	interface IOrig_photo {
		url: string;
	}

	let owner_id = $state('-164431454');
	let album_id = $state('');
	let v = $state('5.131');
	let albums: IVkAlbum[] = $state([]);
	let photos: IVkPhoto[] = $state([]);
	let isModalPhotoShow = $state(false);
	let modalPhotoUrl = $state('');

	let newAlbum = $state('');

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

<div class="d-flex gap-3 mb-4">
	<div class="w-25">
		<h5>Список фотоальбомов:</h5>
		<div class="d-flex flex-column bg-light">
			{#each albums as item, i}
				<button
					class="btn btn-sm {album_id == item.id
						? 'btn-dark text-light'
						: 'btn-light text-dark'} rounded-0 text-start"
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
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="col">
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<div
						class="img-fluid rounded d-flex flex-column"
						style="background-image: url({item?.orig_photo
							?.url}); background-repeat: no-repeat; background-position: center; background-size: cover; min-height:14em;"
						onclick={() => {
							modalPhotoUrl = item.orig_photo.url;
							isModalPhotoShow = true;
						}}>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<Modal bind:isModalShow={isModalPhotoShow} _class="modal-fullscreen">
	<div
		class="img-fluid rounded d-flex flex-column"
		style="background-image: url({modalPhotoUrl}); background-repeat: no-repeat; background-position: center; background-size: contain; height:95vh;">
	</div>
</Modal>

<div>
	<h5>Созлать фотоальбом</h5>
	<div class="d-flex gap-1">
		<input class="form-control" bind:value={newAlbum} placeholder="Новый альбом" />
		<button
			class="btn btn-dark text-light"
			onclick={async () => {
				if (newAlbum.trim() != '') {
					fetch('/api/vkcreatealbum', {
						method: 'POST',
						headers: {
							'Content-type': 'application/json; charset=UTF-8'
						},
						body: JSON.stringify({
							owner_id: '-164431454',
							title: newAlbum,
							album_id,
							v
						})
					})
						.then(r => r.json())
						.then(data => {
							console.log(data);
							newAlbum = '';
						});
				}
			}}>Создать</button>
	</div>
</div>
