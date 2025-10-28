<script lang="ts">
	import { Photo as _Photo } from '$lib/models/photos/Photo';
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import { SETTINGS } from '$lib/store/store.svelte';
	import { onMount } from 'svelte';
	import Modal from '$lib/components/Modal.svelte';
	import type { IVkAlbum, IVkPhoto } from '../photos/vk';

	let owner_id = $state('-164431454');
	let album_id = $state('');
	let v = $state('5.131');
	let albums: IVkAlbum[] = $state([]);
	let photos: IVkPhoto[] = $state([]);
	let modalPhotoUrl = $state('');
	let isModalPhotoShow = $state(false);
	let isVKDataModalShow = $state(false);
	let isCreateVKAlbumModalShow = $state(false);

	let newAlbum = $state('');

	onMount(async () => {
		SETTINGS.Header = header;
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
					albums = (data.response.items as IVkAlbum[]).sort((a, b) =>
						a.title.localeCompare(b.title)
					);

					// Запрашиваем фотографии из первого альбома
					album_id = albums[0].id;
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
				}
			});
	});
</script>

{#snippet header()}
	<PageTitle title="Список фотоальбомов ВК">
		<button
			class="btn btn-dark text-light"
			onclick={() => (isCreateVKAlbumModalShow = !isCreateVKAlbumModalShow)}
			>Создать фотоальбом</button>
		<button class="btn btn-dark text-light" onclick={() => (isVKDataModalShow = !isVKDataModalShow)}
			>Данные VK</button>
	</PageTitle>
{/snippet}

<div class="d-flex gap-3 mb-4">
	<div class="w-25">
		<h5 class="text-dark">Список фотоальбомов:</h5>
		<div class="d-flex flex-column overflow-y-scroll" style="height: 75vh;">
			{#each albums as item, i}
				<button
					class="btn btn-sm {album_id == item.id
						? 'btn-dark text-light'
						: 'btn-light text-dark'} text-start rounded-0"
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
					}}>{item.title}</button>
			{/each}
		</div>
	</div>
	<div class="flex-grow-1" style="width: 70%;">
		<h5 class="text-dark">Фотографии:</h5>
		<div class="row row-cols-1 row-cols-md-4 g-2 overflow-y-scroll" style="height: 75vh;">
			{#each photos as item, i}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="col">
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<div
						class="img-fluid rounded d-flex flex-column"
						style="background-image: url({item?.orig_photo
							?.url}); background-repeat: no-repeat; background-position: center; background-size: cover; min-height:10em;"
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

<!-- Модальное окно фотографией на весь экран -->
<Modal bind:isModalShow={isModalPhotoShow} isBackgroundLight={false} _class="modal-fullscreen">
	<div
		class="card-img"
		style="background-image: url({modalPhotoUrl}); background-repeat: no-repeat; background-position: center; background-size: contain; height:100vh; margin:-.8em 0;">
	</div>
</Modal>

<!-- Модальное окно с данными для запроса из VK -->
<Modal bind:isModalShow={isVKDataModalShow}>
	<div class="d-flex flex-column align-items-start gap-2">
		<h5 class="text-dark">Начальные данные для доступа к вк</h5>
		<div class="d-flex flex-column w-100">
			<div>
				<b>Access_token</b> (токен доступа, можно получить
				<a href="https://vkhost.github.io/" target="_blank">здесь</a>):
			</div>
			<input
				class="form-control bg-light text-dark"
				bind:value={SETTINGS.vkAccessToken}
				placeholder="access_token" />
		</div>
		<div class="d-flex flex-column w-100">
			<div><b>Owner_id</b> (id группы вк, с которой берутся фото):</div>
			<input class="form-control bg-light text-dark" bind:value={owner_id} placeholder="owner_id" />
		</div>
		<div class="d-flex align-items-center justify-content-end gap-1 w-100">
			<button class="btn btn-light text-dark" onclick={() => (isVKDataModalShow = false)}
				>Отмена</button>
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
								albums = (data.response.items as IVkAlbum[]).sort((a, b) =>
									a.title.localeCompare(b.title)
								);
							}
						});
					isVKDataModalShow = false;
				}}>Запросить фотографии</button>
		</div>
	</div>
</Modal>

<!-- Модальное окно для создания альбома VK -->
<Modal bind:isModalShow={isCreateVKAlbumModalShow}>
	<div class="d-flex flex-column align-items-start gap-2">
		<h5 class="text-dark">Создать новый фотоальбом VK</h5>
		<div class="d-flex flex-column w-100">
			<input
				class="form-control bg-light text-dark"
				bind:value={newAlbum}
				placeholder="Название фотоальбома" />
		</div>
		<div class="d-flex align-items-center justify-content-end gap-1 w-100">
			<button class="btn btn-light text-dark" onclick={() => (isCreateVKAlbumModalShow = false)}
				>Отмена</button>
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
								owner_id: owner_id,
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
					isCreateVKAlbumModalShow = false;
				}}>Создать</button>
		</div>
	</div>
</Modal>
