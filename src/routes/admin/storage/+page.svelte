<script lang="ts">
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import { storage } from '$lib/scripts/firebase';
	import { Header } from '$lib/scripts/store';
	import {
		uploadBytes,
		ref,
		getDownloadURL,
		listAll,
		uploadString,
		deleteObject,
		type StorageReference
	} from 'firebase/storage';
	import { onDestroy, onMount } from 'svelte';

	let tabs = $state({ selectedTab: 0, tab: ['Хранилище фотографий', 'Хранилище документов'] });
	let folders: StorageReference[] = $state([]);
	let photos: StorageReference[] = $state([]);
	let photosForUpload: FileList | undefined = $state();
	let documents: StorageReference[] = $state([]);
	let documentsForUpload: FileList | undefined = $state();

	// Корневая папка для фотографий
	let albumsFolder = '/Photos';
	let albumsRef: StorageReference = $derived(ref(storage, `${albumsFolder}`));
	let newFolderName = $state('');
	let selectedFolder = $state(0);
	let labelFakeForUploadButton = $state('Добавить новые');

	// Корневая папка для документов
	let documentsFolder = '/Documents';
	let documentsRef: StorageReference = $derived(ref(storage, `${documentsFolder}`));

	$Header = header;

	let getFolders = () => listAll(albumsRef).then(result => (folders = result.prefixes));
	let getPhotos = () => {
		if (folders.length > 0) {
			listAll(ref(storage, folders[selectedFolder].fullPath)).then(s => {
				photos = s.items.filter(p => p.name != 'empty');
			});
		}
	};
	let getDocuments = () => {
		if (folders.length > 0) {
			listAll(documentsRef).then(s => {
				documents = s.items;
			});
		}
	};

	let downloadImage = async (imageSrc: string, title: string) => {
		fetch(imageSrc)
			.then(r => r.blob())
			.then(r => {
				let link = document.createElement('a');
				link.href = URL.createObjectURL(r);
				link.download = title;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			});
	};

	onMount(async () => {
		getFolders().then(() => {
			getPhotos();
			getDocuments();
		});
	});
	onDestroy(() => ($Header = null));
</script>

{#snippet header()}
	<PageTitle title={tabs.tab[tabs.selectedTab]}>
		<div class="nav d-flex flex-wrap">
			<a
				class="flex-grow-1 btn btn-light text-dark border-0 rounded-0 rounded-start py-2 active"
				data-bs-toggle="tab"
				href="#photos"
				onclick={() => (tabs.selectedTab = 0)}>Фотографии</a>
			<a
				class="flex-grow-1 btn btn-light text-dark rounded-0 rounded-end border-0 py-2"
				data-bs-toggle="tab"
				href="#documents"
				onclick={() => (tabs.selectedTab = 1)}>Документы</a>
		</div>
	</PageTitle>
{/snippet}

<div class="tab-content">
	<div id="photos" class="tab-pane fade show active">
		<div class="d-flex flex-column gap-3">
			<div class="bg-white rounded p-3">
				<PageTitle title="Папки с фотографиями" _class="mb-1">
					<div class="input-group">
						<div class="input-group-text border-0">Создать папку:</div>
						<input
							class="form-control bg-light text-dark border-0"
							bind:value={newFolderName}
							placeholder="имя новой папки" />
						<button
							class="btn btn-light text-dark"
							onclick={() => (newFolderName = '')}
							aria-label="имя новой папки"><i class="fa-solid fa-delete-left"></i></button>
						<button
							class="btn btn-dark"
							onclick={() => {
								// Пустой объект для создания новой папки
								const empty = ref(storage, `${albumsFolder}/${newFolderName}/empty`);
								// Создаём папку и записываем в неё пустой объект
								uploadString(empty, 'Строка для инициализации папки').then(s => {
									selectedFolder = 0;
									newFolderName = '';
									getFolders();
									getPhotos();
								});
							}}>Создать</button>
					</div>
				</PageTitle>
				<div class="d-flex flex-wrap justify-content-start align-items-start gap-2 mb-1">
					{#each folders as item, i}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="d-flex align-items-center {selectedFolder == i
								? 'bg-dark text-light'
								: 'bg-light'} px-2 rounded-1"
							style="cursor:pointer"
							onclick={() => {
								selectedFolder = i;
								getPhotos();
							}}>
							<div class="p-1 text-wrap {selectedFolder == i ? 'text-light' : 'text-dark'}">
								{item.name}
							</div>
							<button
								class="btn btn-sm {selectedFolder == i ? 'btn-dark' : 'btn-light'} text-danger"
								onclick={e => {
									e.stopPropagation();
									listAll(ref(storage, `/${item.fullPath}`)).then(s => {
										if (s.items.filter(p => p.name != 'empty').length == 0) {
											deleteObject(ref(storage, `${item.fullPath}/empty`)).then(() => {
												selectedFolder = 0;
												getFolders();
												getPhotos();
											});
										}
									});
								}}
								aria-label=""><i class="fa-solid fa-xmark"></i></button>
						</div>
					{/each}
				</div>
			</div>
			<div class="bg-white rounded p-3">
				<PageTitle
					title={`Фотографии в папке "${folders[selectedFolder]?.name ?? ''}"`}
					_class="mb-1">
					<div>
						<button
							class="btn btn-dark text-light"
							onclick={() => {
								document.querySelector('#buttonSelectPhotos')?.click();
							}}><i class="fa-solid fa-cloud-arrow-up me-1"></i>{labelFakeForUploadButton}</button>
						<input
							id="buttonSelectPhotos"
							hidden
							type="file"
							accept="image/*"
							multiple
							class="form-control bg-light text-dark border-0"
							bind:files={photosForUpload}
							onchange={() => {
								if (photosForUpload != undefined && photosForUpload.length > 0) {
									labelFakeForUploadButton = 'Файлы загружаются';
									Array.from(photosForUpload).forEach((p, i, a) => {
										uploadBytes(
											ref(
												storage,
												`/${albumsFolder}/${folders[selectedFolder].name}/${p.name.replace('(', '').replace(')', '')}`
											),
											p
										).then(() => {
											if (i == a.length - 1) {
												getPhotos();
												photosForUpload = undefined;
												labelFakeForUploadButton = 'Загрузка завершена';
												setTimeout(() => {
													labelFakeForUploadButton = 'Добавить новые';
												}, 1000);
											}
										});
									});
								}
							}} />
					</div>
				</PageTitle>
				{#if photos.length > 0}
					<div class="d-flex justify-content-between flex-wrap gap-2 mb-1">
						{#each photos as photo}
							{#await getDownloadURL(ref(storage, photo.fullPath)) then s}
								<div
									class="d-flex align-items-start justify-content-end rounded-1 gap-1 p-1"
									style="min-width: calc(98.5% / 3); background-image: url({s}); background-repeat: no-repeat; background-position: center; background-size: cover; min-height:12em;">
									<button
										aria-label=""
										class="btn btn-sm btn-light bg-light bg-opacity-25 border-0 text-dark"
										title="Скачать фотографию"
										onclick={() => downloadImage(s, photo.name)}>
										<i class="fa-solid fa-cloud-arrow-down"></i>
									</button>
									<button
										aria-label=""
										class="btn btn-sm btn-light bg-light bg-opacity-25 border-0 text-dark"
										title="Скопировать url"
										onclick={() => {
											navigator.clipboard.writeText(s).then(s => {});
										}}>
										<i class="fa-solid fa-copy"></i>
									</button>
									<button
										aria-label=""
										class="btn btn-sm btn-light bg-light bg-opacity-25 border-0 text-danger"
										title="Удалить фото"
										onclick={() => {
											deleteObject(
												ref(
													storage,
													`/${albumsFolder}/${folders[selectedFolder].name}/${photo.name}`
												)
											);
											getPhotos();
										}}>
										<i class="fa-solid fa-xmark"></i>
									</button>
								</div>
							{/await}
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div id="documents" class="tab-pane fade">
		<div class="bg-white rounded p-3">
			<PageTitle title={'Документы'} _class="mb-1">
				<div>
					<button
						class="btn btn-dark text-light"
						onclick={() => {
							document.querySelector('#buttonSelectDocuments')?.click();
						}}><i class="fa-solid fa-cloud-arrow-up me-1"></i>{labelFakeForUploadButton}</button>
					<input
						id="buttonSelectDocuments"
						hidden
						type="file"
						multiple
						accept="application/pdf,application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
						class="form-control bg-light text-dark border-0"
						bind:files={documentsForUpload}
						onchange={() => {
							if (documentsForUpload != undefined && documentsForUpload.length > 0) {
								labelFakeForUploadButton = 'Файлы загружаются';
								Array.from(documentsForUpload).forEach((p, i, a) => {
									uploadBytes(
										ref(storage, `/${documentsFolder}/${p.name.replace('(', '').replace(')', '')}`),
										p
									).then(() => {
										if (i == a.length - 1) {
											getDocuments();
											documentsForUpload = undefined;
											labelFakeForUploadButton = 'Загрузка завершена';
											setTimeout(() => {
												labelFakeForUploadButton = 'Загрузить новые';
											}, 1000);
										}
									});
								});
							}
						}} />
				</div>
			</PageTitle>
			{#if documents.length > 0}
				<div class="d-flex flex-column align-items-start gap-2">
					{#each documents as doc}
						{#await getDownloadURL(ref(storage, doc.fullPath)) then s}
							<div class="d-flex align-items-center justify-content-end bg-light rounded-1 p-1">
								<div class="ps-2 pe-3 text-dark">{doc.name}</div>
								<a
									aria-label=""
									class="btn btn-sm btn-light border-0 text-dark"
									title="Скачать файл"
									href={s}
									download>
									<i class="fa-solid fa-cloud-arrow-down"></i>
								</a>
								<button
									aria-label=""
									class="btn btn-sm btn-light border-0 text-dark"
									title="Скопировать url"
									onclick={() => {
										navigator.clipboard.writeText(s).then(s => {});
									}}><i class="fa-solid fa-copy"></i></button>
								<button
									aria-label=""
									class="btn btn-sm btn-light border-0 text-danger"
									title="Удалить"
									onclick={() => {
										deleteObject(ref(storage, `/${documentsFolder}/${doc.name}`));
										getDocuments();
									}}>
									<i class="fa-solid fa-xmark"></i>
								</button>
							</div>
						{/await}
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	a.active {
		background: var(--bs-dark) !important;
		color: var(--bs-light) !important;
	}
</style>
