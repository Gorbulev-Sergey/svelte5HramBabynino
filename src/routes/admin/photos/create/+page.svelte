<script>
	// @ts-nocheck
	import PageTitleWrap from '$lib/components/PageTitleWrap.svelte';
	import Photo from '$lib/components/photos/Photo.svelte';
	import { goto } from '$app/navigation';
	import { Photo as _Photo } from '$lib/models/photos/Photo';
	import { Album } from '$lib/models/photos/Album';
	import { db, storage } from '$lib/scripts/firebase';
	import { push, ref as refDb } from 'firebase/database';
	import { ref, getDownloadURL, listAll } from 'firebase/storage';
	import { onMount } from 'svelte';

	let album = new Album();

	// Для работы с хранилищем
	let folders = [];
	let photos = [];
	let albumsFolder = '/Photos';
	let albumsRef = ref(storage, `${albumsFolder}`);
	let selectedFolder = 0;
	let checkedPhotos = [];
	let getFolders = () => listAll(ref(storage, albumsRef)).then(result => (folders = result.prefixes));
	let getPhotos = () => {
		if (folders.length > 0) {
			listAll(ref(storage, ref(storage, folders[selectedFolder].fullPath))).then(s => {
				photos = s.items.filter(p => p.name != 'empty');
			});
		}
	};

	onMount(() => {
		getFolders().then(() => {
			getPhotos();
		});
	});
</script>

<PageTitleWrap title="Создать фотоальбом">
	<div slot="navigation">
		<button class="btn btn-light" on:click={() => goto(`/admin/photos`)}>Отмена</button>
		<button
			class="btn btn-dark"
			on:click={async () => {
				if (!album.cover && album.photos.length > 0) album.cover = album.photos[0].url;
				push(refDb(db, '/photos'), album);
				goto('/admin/photos');
			}}>Сохранить</button>
	</div>
</PageTitleWrap>

<div class="rounded p-3 bg-white text-dark">
	<div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
		<div class="nav nav-pills">
			<a class="btn btn-light border-0 me-1 active" data-bs-toggle="pill" href="#cover">Обложка</a>
			<a class="btn btn-light border-0" data-bs-toggle="pill" href="#content">Фотографии</a>
		</div>
	</div>

	<div class="tab-content">
		<!-- Вкладка обложка -->
		<div id="cover" class="tab-pane active show">
			<div class="row">
				<div class="col-md-8">
					<input class="form-control mb-3 bg-light text-dark" placeholder="заголовок" bind:value={album.title} />
					<input class="form-control mb-3 bg-light text-dark" placeholder="описание" bind:value={album.description} />
					<div class="input-group mb-3">
						<span class="input-group-text bg-dark text-light">Дата публикации</span>
						<input type="date" class="form-control bg-light text-dark" bind:value={album.date} />
					</div>
				</div>
				<div class="col-md-4">
					<div class="form-group mb-3">
						<input class="form-control mb-3 bg-light text-dark" placeholder="обложка (url фото)" bind:value={album.cover} />
						{#if album.cover}
							<img class="card-img rounded" src={album.cover} alt="" />
						{/if}
					</div>
				</div>
			</div>
		</div>
		<!-- Вкладка содержимое -->
		<div id="content" class="tab-pane">
			<div class="d-flex flex-wrap gap-1 mb-3">
				<button class="btn btn-sm btn-dark me-1" on:click={() => (album.photos = [...album.photos, new _Photo()])}><i class="fa-solid fa-plus" /> 1 фото </button>
				<button
					class="btn btn-sm btn-dark me-1"
					on:click={() => {
						for (let i = 0; i < 5; i++) {
							album.photos = [...album.photos, new _Photo()];
						}
					}}
					><i class="fa-solid fa-plus" /> 5 фото
				</button>
				<button
					class="btn btn-sm btn-dark me-1"
					on:click={() => {
						for (let i = 0; i < 10; i++) {
							album.photos = [...album.photos, new _Photo()];
						}
					}}
					><i class="fa-solid fa-plus" /> 10 фото
				</button>
				<button class="btn btn-sm btn-dark me-1" data-bs-toggle="modal" data-bs-target="#modalStoragePhotos">
					<i class="fa-solid fa-cloud-arrow-down me-1" />из хранилища
				</button>
			</div>
			<div class="row row-cols-1 row-cols-md-3 g-3">
				{#each album.photos as photo, i}
					<div class="col">
						<Photo
							{photo}
							onUp={() => {
								album.photos.splice(i - 1, 0, album.photos.splice(i, 1)[0]);
								album.photos = [...album.photos];
							}}
							onDown={() => {
								album.photos.splice(i + 1, 0, album.photos.splice(i, 1)[0]);
								album.photos = [...album.photos];
							}}
							onDelete={() => (album.photos = album.photos.filter(p => p != photo))} />
					</div>
				{/each}
			</div>
			<!-- Фотографии из хранилища (модальное окно) -->
			<div id="modalStoragePhotos" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false">
				<div class="modal-dialog modal-dialog-centered">
					<div class="modal-content bg-light text-dark p-3">
						<div class="d-flex justify-content-between align-items-center">
							<h5 class="pb-0">Добавить фотографии из хранилища</h5>
							<button class="btn btn-sm btn-light text-dark" data-bs-dismiss="modal"><i class="fa-solid fa-xmark" /></button>
						</div>
						<div class="my-3">
							<!-- Папки -->
							<div class="d-flex gap-2 mb-3">
								<b class="my-1">Папки:</b>
								<div class="flex-grow-1 d-flex flex-wrap gap-1">
									{#each folders as item, i}
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<!-- svelte-ignore a11y-no-static-element-interactions -->
										<div
											class="d-flex align-items-top {selectedFolder == i ? 'bg-dark text-light' : 'bg-light'} px-2 rounded-1"
											style="cursor:pointer"
											on:click={() => {
												selectedFolder = i;
												getPhotos();
											}}>
											<div class="text-wrap p-1 {selectedFolder == i ? 'text-light' : 'text-dark'}">{item.name}</div>
										</div>
									{/each}
								</div>
							</div>
							<!-- Фотографии из папки -->
							<div>
								<b>Фотографии:</b>
								<div class="mt-2">
									{#if photos.length > 0}
										<div class="d-flex flex-wrap gap-2">
											{#each photos as photo, i}
												{#await getDownloadURL(ref(storage, photo.fullPath)) then s}
													<!-- svelte-ignore a11y-click-events-have-key-events -->
													<!-- svelte-ignore a11y-no-static-element-interactions -->
													<div
														class="d-flex align-items-start justify-content-end rounded-1 gap-1 p-1"
														style="width:31.5%; background-image: url({s}); background-repeat: no-repeat; background-position: center; background-size: cover; min-height:6.1em;"
														on:click={() => (checkedPhotos = !checkedPhotos.includes(s) ? [...checkedPhotos, s] : checkedPhotos.filter(v => v != s))}>
														<input type="checkbox" class="form-check" value={s} bind:group={checkedPhotos} />
													</div>
												{/await}
											{/each}
										</div>
									{/if}
								</div>
							</div>
						</div>
						<div class="d-flex justify-content-end align-items-center gap-1">
							<button class="btn btn-light text-dark" data-bs-dismiss="modal" on:click={() => (checkedPhotos = [])}>Отмена</button>
							<button
								class="btn btn-dark text-light"
								data-bs-dismiss="modal"
								on:click={() => {
									if (checkedPhotos.length > 0) {
										checkedPhotos.forEach(v => {
											album.photos = [...album.photos, new _Photo(null, v)];
										});
										checkedPhotos = [];
									}
								}}>Добавить</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
