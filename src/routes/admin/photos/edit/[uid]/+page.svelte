<script lang="ts">
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import Photo from '$lib/components/photos/Photo.svelte';
	import { goto } from '$app/navigation';
	import { Photo as _Photo } from '$lib/models/photos/Photo';
	import { Album } from '$lib/models/photos/Album';
	import { db, storage } from '$lib/scripts/firebase';
	import { onValue, push, ref as refDb, update } from 'firebase/database';
	import { ref, getDownloadURL, listAll, type StorageReference } from 'firebase/storage';
	import { onMount } from 'svelte';
	import SubTitle from '$lib/components/admin/SubTitle.svelte';
	import { SETTINGS } from '$lib/store/store.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { page } from '$app/state';
	import type { IVkAlbum, IVkPhoto } from '../../vk';

	let album = $state(Album());
	let checkedPhotos: string[] = $state([]);
	let isSecondTabActive = $state(false);

	// Для работы с фотографиями Firestore
	interface IFirestore {
		ref: StorageReference;
		isModalShow: boolean;
		albums: StorageReference[];
		photos: StorageReference[];
		selectedAlbumIndex: number;
		getPhotos: () => void;
	}
	let firestore = $state<IFirestore>({
		ref: ref(storage, '/Photos'),
		isModalShow: false,
		albums: [],
		photos: [],
		selectedAlbumIndex: 0,
		getPhotos: () => {
			if (firestore.albums.length > 0) {
				listAll(
					ref(storage, firestore.albums[$state.snapshot(firestore.selectedAlbumIndex)].fullPath)
				).then(s => {
					firestore.photos = s.items.filter(p => p.name != 'empty');
				});
			}
		}
	});

	// Для работы с фотографиями VK
	interface IVK {
		isModalShow: boolean;
		albums: IVkAlbum[];
		photos: IVkPhoto[];
		selectedAlbumId: string;
		owner_id: string;
		v: string;
	}
	let vk = $state<IVK>({
		isModalShow: false,
		albums: [],
		photos: [],
		selectedAlbumId: '',
		owner_id: '-164431454',
		v: '5.131'
	});

	onMount(async () => {
		SETTINGS.Header = header;
		onValue(refDb(db, `/photos/${page.params.uid}`), s => {
			if (s.exists()) {
				album = s.val();
			}
		});
	});
</script>

{#snippet header()}
	<PageTitle title="Редактировать фотоальбом">
		<button class="btn btn-light" onclick={() => goto(`/admin/photos`)}>Отмена</button>
		<button
			class="btn btn-dark"
			onclick={async () => {
				if (!album.cover && album.photos.length > 0) album.cover = album.photos[0].url;
				update(refDb(db, `/photos/${page.params.uid}`), album);
				goto('/admin/photos');
			}}>Сохранить</button>
	</PageTitle>
	<SubTitle _class="pe-3">
		<div class="d-flex flex-wrap justify-content-between align-items-center">
			<div class="nav nav-pills">
				<a
					class="btn btn-light border-0 me-1 active"
					data-bs-toggle="pill"
					href="#cover"
					onclick={() => (isSecondTabActive = false)}>Обложка</a>
				<a
					class="btn btn-light border-0"
					data-bs-toggle="pill"
					href="#content"
					onclick={() => (isSecondTabActive = true)}>Фотографии</a>
			</div>
			{#if isSecondTabActive}
				<div class="d-flex flex-wrap gap-1 mb-3">
					<button class="btn btn-sm btn-dark me-1" onclick={() => album.photos.push(_Photo())}
						><i class="fa-solid fa-plus"></i> 1 фото
					</button>
					<button
						class="btn btn-sm btn-dark me-1"
						onclick={() => {
							[...new Array(5)].forEach(i => album.photos.push(_Photo()));
						}}
						><i class="fa-solid fa-plus"></i> 5 фото
					</button>
					<button
						class="btn btn-sm btn-dark me-1"
						onclick={() => {
							[...new Array(10)].forEach(i => album.photos.push(_Photo()));
						}}
						><i class="fa-solid fa-plus"></i> 10 фото
					</button>
					<button
						class="btn btn-sm btn-primary me-1"
						onclick={() => {
							firestore.isModalShow = true;
							listAll(firestore.ref).then(result => {
								firestore.albums = result.prefixes;
								if (firestore.photos.length == 0) {
									firestore.getPhotos();
								}
							});
						}}>
						<i class="fa-solid fa-cloud-arrow-down me-1"></i>из Firestore
					</button>
					<button
						class="btn btn-sm btn-primary me-1"
						onclick={() => {
							vk.isModalShow = true;
							// Запрашиваем список альбомов VK
							fetch('/api/vkalbums', {
								method: 'POST',
								headers: {
									'Content-type': 'application/json; charset=UTF-8'
								},
								body: JSON.stringify({
									owner_id: vk.owner_id,
									v: vk.v
								})
							})
								.then(r => r.json())
								.then(data => {
									if (data.response) {
										vk.albums = [...data.response.items].sort((a, b) =>
											a.title.localeCompare(b.title)
										);

										// Запрашиваем фотографии из первого альбома VK
										if (vk.selectedAlbumId == '') {
											vk.selectedAlbumId = vk.albums[0].id;
											fetch('/api/vkphotos', {
												method: 'POST',
												headers: {
													'Content-type': 'application/json; charset=UTF-8'
												},
												body: JSON.stringify({
													owner_id: vk.owner_id,
													album_id: vk.selectedAlbumId,
													v: vk.v
												})
											})
												.then(r => r.json())
												.then(data => {
													if (data.response) {
														vk.photos = data.response.items;
													}
												});
										}
									}
								});
						}}>
						<i class="fa-solid fa-cloud-arrow-down me-1"></i>из VK
					</button>
				</div>
			{/if}
		</div>
	</SubTitle>
{/snippet}

<div class="rounded p-3 bg-white text-dark">
	<div class="tab-content">
		<!-- Вкладка обложка -->
		<div id="cover" class="tab-pane active show">
			<div class="row">
				<div class="col-md-8">
					<input
						class="form-control mb-3 bg-light text-dark"
						placeholder="заголовок"
						bind:value={album.title} />
					<input
						class="form-control mb-3 bg-light text-dark"
						placeholder="описание"
						bind:value={album.description} />
					<div class="input-group mb-3">
						<span class="input-group-text bg-dark text-light">Дата публикации</span>
						<input type="date" class="form-control bg-light text-dark" bind:value={album.date} />
					</div>
				</div>
				<div class="col-md-4">
					<div class="form-group mb-3">
						<input
							class="form-control mb-3 bg-light text-dark"
							placeholder="обложка (url фото)"
							bind:value={album.cover} />
						{#if album.cover}
							<img class="card-img rounded" src={album.cover} alt="" />
						{/if}
					</div>
				</div>
			</div>
		</div>
		<!-- Вкладка содержимое -->
		<div id="content" class="tab-pane">
			<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-2">
				{#each new Array(album.photos.length) as _, i}
					<div class="col">
						<Photo
							bind:photo={album.photos[i]}
							onUp={() => album.photos.splice(i - 1, 0, album.photos.splice(i, 1)[0])}
							onDown={() => album.photos.splice(i + 1, 0, album.photos.splice(i, 1)[0])}
							onDelete={() => album.photos.splice(i, 1)} />
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<!-- Фотографии из хранилища (модальное окно) -->
<Modal isModalShow={firestore.isModalShow} isFullScreen={true}>
	<h5 class="mx-2">Добавить фотографии из Firestore</h5>
	<div class="d-flex gap-3 p-2 overflow-hidden">
		<!-- Папки -->
		<div class="d-flex flex-column flex-nowrap gap-2">
			<b>Папки:</b>
			<div class="overflow-y-scroll pe-1">
				<div class="d-flex flex-column flex-nowrap gap-1">
					{#each firestore.albums as item, i}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="d-flex flex-nowrap align-items-top {firestore.selectedAlbumIndex == i
								? 'bg-dark text-light'
								: 'bg-light'} px-2 rounded-1"
							style="cursor:pointer"
							onclick={() => {
								firestore.selectedAlbumIndex = i;
								firestore.getPhotos();
							}}>
							<div
								class="text-wrap p-1 {firestore.selectedAlbumIndex == i
									? 'text-light'
									: 'text-dark'}">
								{item.name}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<!-- Фотографии -->
		<div class="flex-grow-1 d-flex flex-column gap-2" style="min-width: 70%;">
			<b>Фотографии:</b>
			<div class="overflow-y-scroll overflow-x-hidden">
				<div>
					{#if firestore.photos.length > 0}
						<div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-2 justify-content-start">
							{#each firestore.photos as photo, i}
								<div class="col">
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									{#await getDownloadURL(ref(storage, photo.fullPath)) then s}
										<!-- svelte-ignore a11y_click_events_have_key_events -->
										<!-- svelte-ignore a11y_no_static_element_interactions -->
										<div
											class="d-flex align-items-start justify-content-end rounded-1 gap-1 p-1"
											style="background-image: url({s}); background-repeat: no-repeat; background-position: center; background-size: cover; min-height:7.4em;"
											onclick={() => {
												checkedPhotos = !checkedPhotos.includes(s)
													? [...checkedPhotos, s]
													: checkedPhotos.filter(v => v != s);
											}}>
											<input
												type="checkbox"
												class="form-check"
												value={s}
												bind:group={checkedPhotos} />
										</div>
									{/await}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
	<div class="d-flex justify-content-end align-items-center gap-1">
		<button
			class="btn btn-light text-dark"
			data-bs-dismiss="modal"
			onclick={() => {
				checkedPhotos = [];
				firestore.isModalShow = false;
			}}>Отмена</button>
		<button
			class="btn btn-dark text-light"
			data-bs-dismiss="modal"
			onclick={() => {
				if (checkedPhotos.length > 0) {
					checkedPhotos.forEach(v => {
						album.photos = [...album.photos, _Photo('', v)];
					});
					checkedPhotos = [];
					firestore.isModalShow = false;
				}
			}}>Добавить</button>
	</div>
</Modal>

<!-- Фотографии из VK (модальное окно) -->
<Modal isModalShow={vk.isModalShow} isFullScreen={true}>
	<h5 class="mx-2">Добавить фотографии из VK</h5>
	<div class="d-flex gap-3 p-2 overflow-hidden">
		<!-- Папки -->
		<div class="d-flex flex-column flex-nowrap gap-2">
			<b>Папки:</b>
			<div class="overflow-y-scroll pe-1">
				<div class="d-flex flex-column flex-nowrap gap-1">
					{#each vk.albums as item, i}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="d-flex flex-nowrap align-items-top {vk.selectedAlbumId == item.id
								? 'bg-dark text-light'
								: 'bg-light text-dark'} px-2 rounded-1"
							style="cursor:pointer"
							onclick={() => {
								vk.selectedAlbumId = item.id;
								vk.photos = [];
								for (let offset = 0; offset < item.size; offset += 50) {
									fetch('/api/vkphotos', {
										method: 'POST',
										headers: {
											'Content-type': 'application/json; charset=UTF-8'
										},
										body: JSON.stringify({
											owner_id: vk.owner_id,
											album_id: vk.selectedAlbumId,
											v: vk.v,
											offset: offset
										})
									})
										.then(r => r.json())
										.then(data => {
											if (data.response) {
												vk.photos = [...vk.photos, ...data.response.items];
											}
										});
								}
							}}>
							<div
								class="text-wrap p-1 {vk.selectedAlbumId == item.id ? 'text-light' : 'text-dark'}">
								{item.title}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<!-- Фотографии -->
		<div class="flex-grow-1 d-flex flex-column gap-2" style="min-width: 70%;">
			<b>Фотографии:</b>
			<div class="overflow-y-scroll overflow-x-hidden">
				<div>
					{#if vk.photos.length > 0}
						<div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-2 justify-content-start">
							{#each vk.photos as item, i}
								<div class="col">
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<div
										class="d-flex align-items-start justify-content-end rounded-1 gap-1 p-1"
										style="background-image: url({item?.orig_photo
											?.url}); background-repeat: no-repeat; background-position: center; background-size: cover; min-height:7.4em;"
										onclick={() => {
											checkedPhotos = !checkedPhotos.includes(item?.orig_photo?.url)
												? [...checkedPhotos, item?.orig_photo?.url]
												: checkedPhotos.filter(v => v != item?.orig_photo?.url);
										}}>
										<input
											type="checkbox"
											class="form-check"
											value={item?.orig_photo?.url}
											bind:group={checkedPhotos} />
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
	<div class="d-flex justify-content-end align-items-center gap-1">
		<button
			class="btn btn-light text-dark"
			data-bs-dismiss="modal"
			onclick={() => {
				checkedPhotos = [];
				vk.isModalShow = false;
			}}>Отмена</button>
		<button
			class="btn btn-dark text-light"
			data-bs-dismiss="modal"
			onclick={() => {
				if (checkedPhotos.length > 0) {
					checkedPhotos.forEach(v => {
						album.photos = [...album.photos, _Photo('', v)];
					});
					checkedPhotos = [];
					vk.isModalShow = false;
				}
			}}>Добавить</button>
	</div>
</Modal>
