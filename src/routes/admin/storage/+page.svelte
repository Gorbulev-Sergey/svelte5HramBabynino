<script lang="ts">
	import PageTitleWrap from '$lib/components/PageTitleWrap.svelte';
	import { storage } from '$lib/scripts/firebase';
	import {
		uploadBytes,
		ref,
		getDownloadURL,
		listAll,
		uploadString,
		deleteObject,
		type StorageReference
	} from 'firebase/storage';
	import { onMount } from 'svelte';

	let tabs = { selectedTab: 0, tab: ['Хранилище фотографий', 'Хранилище документов'] };
	let folders: any[] = [];
	let photos: any[] = [];
	let photosForUpload: FileList;
	let documents: any[] = [];
	let documentsForUpload: FileList;

	// Корневая папка для фотографий
	let albumsFolder = '/Photos';
	let albumsRef: StorageReference = ref(storage, `${albumsFolder}`);
	let newFolderName = '';
	let selectedFolder = 0;
	let labelFakeForUploadButton = 'Загрузить новые';

	// Корневая папка для документов
	let documentsFolder = '/Documents';
	let documentsRef: StorageReference = ref(storage, `${documentsFolder}`);

	let getFolders = () =>
		listAll(ref(storage, albumsRef)).then(result => (folders = result.prefixes));
	let getPhotos = () => {
		if (folders.length > 0) {
			listAll(ref(storage, ref(storage, folders[selectedFolder].fullPath))).then(s => {
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
</script>

<PageTitleWrap title={tabs.tab[tabs.selectedTab]} _class="text-uppercase mb-4">
	<div slot="navigation">
		<div class="nav d-flex flex-wrap">
			<a
				class="flex-grow-1 btn btn-light text-dark border-0 rounded-0 rounded-start py-2 active"
				data-bs-toggle="tab"
				href="#photos"
				on:click={() => (tabs.selectedTab = 0)}>Фотографии</a>
			<a
				class="flex-grow-1 btn btn-light text-dark rounded-0 rounded-end border-0 py-2"
				data-bs-toggle="tab"
				href="#documents"
				on:click={() => (tabs.selectedTab = 1)}>Документы</a>
		</div>
	</div>
</PageTitleWrap>

<div class="tab-content">
	<div id="photos" class="tab-pane fade show active">
		<PageTitleWrap title="Папки с фотографиями">
			<div slot="navigation">
				<div class=" input-group">
					<div class="input-group-text border-0">Создать папку:</div>
					<input
						class="form-control bg-light text-dark border-0"
						bind:value={newFolderName}
						placeholder="имя новой папки" />
					<button
						class="btn btn-light text-dark"
						on:click={() => (newFolderName = '')}
						aria-label=""><i class="fa-solid fa-delete-left"></i></button>
					<button
						class="btn btn-dark"
						on:click={() => {
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
			</div>
		</PageTitleWrap>
		<div class="d-flex flex-wrap justify-content-start align-items-start gap-2 mb-5">
			{#each folders as item, i}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="d-flex align-items-center {selectedFolder == i
						? 'bg-dark text-light'
						: 'bg-light'}  px-2 rounded-1"
					style=" cursor:pointer"
					on:click={() => {
						selectedFolder = i;
						getPhotos();
					}}>
					<div class="p-2 text-wrap {selectedFolder == i ? 'text-light' : 'text-dark'}">
						{item.name}
					</div>
					<button
						class="btn btn-sm {selectedFolder == i ? 'btn-dark' : 'btn-light'} text-danger"
						on:click|stopPropagation={() => {
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
		<PageTitleWrap title={`Фотографии в папке "${folders[selectedFolder]?.name ?? ''}"`}>
			<div slot="navigation">
				<div>
					<button
						class="btn btn-dark text-light"
						on:click={() => {
							document.querySelector('#buttonSelectPhotos')?.click();
						}}><i class="fa-solid fa-cloud-arrow-up me-1" />{labelFakeForUploadButton}</button>
					<input
						id="buttonSelectPhotos"
						hidden
						type="file"
						accept="image/*"
						multiple
						class="form-control bg-light text-dark border-0"
						bind:files={photosForUpload}
						on:change={() => {
							if (photosForUpload.length > 0) {
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
											photosForUpload = [] as unknown as FileList;
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
			</div>
		</PageTitleWrap>
		{#if photos.length > 0}
			<div class="d-flex flex-wrap gap-2">
				{#each photos as photo}
					{#await getDownloadURL(ref(storage, photo.fullPath)) then s}
						<div
							class="d-flex align-items-start justify-content-end rounded-1 gap-1 p-1"
							style="width:31.5%; background-image: url({s}); background-repeat: no-repeat; background-position: center; background-size: cover; min-height:12em;">
							<button
								aria-label=""
								class="btn btn-sm btn-light bg-light bg-opacity-25 border-0 text-dark"
								title="Скачать фотографию"
								on:click={() => downloadImage(s, photo.name)}>
								<i class="fa-solid fa-cloud-arrow-down"></i>
							</button>
							<button
								aria-label=""
								class="btn btn-sm btn-light bg-light bg-opacity-25 border-0 text-dark"
								title="Скопировать url"
								on:click={() => {
									navigator.clipboard.writeText(s).then(s => {});
								}}>
								<i class="fa-solid fa-copy"></i>
							</button>
							<button
								aria-label=""
								class="btn btn-sm btn-light bg-light bg-opacity-25 border-0 text-danger"
								title="Удалить фото"
								on:click={() => {
									deleteObject(
										ref(storage, `/${albumsFolder}/${folders[selectedFolder].name}/${photo.name}`)
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
	<div id="documents" class="tab-pane fade">
		<PageTitleWrap title={'Документы'}>
			<div slot="navigation">
				<div>
					<button
						class="btn btn-dark text-light"
						on:click={() => {
							document.querySelector('#buttonSelectDocuments')?.click();
						}}><i class="fa-solid fa-cloud-arrow-up me-1" />{labelFakeForUploadButton}</button>
					<input
						id="buttonSelectDocuments"
						hidden
						type="file"
						multiple
						accept="application/pdf,application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
						class="form-control bg-light text-dark border-0"
						bind:files={documentsForUpload}
						on:change={() => {
							if (documentsForUpload.length > 0) {
								labelFakeForUploadButton = 'Файлы загружаются';
								Array.from(documentsForUpload).forEach((p, i, a) => {
									uploadBytes(
										ref(storage, `/${documentsFolder}/${p.name.replace('(', '').replace(')', '')}`),
										p
									).then(() => {
										if (i == a.length - 1) {
											getDocuments();
											documentsForUpload = [] as unknown as FileList;
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
			</div>
		</PageTitleWrap>
		{#if documents.length > 0}
			<div class="d-flex flex-column align-items-start gap-2">
				{#each documents as doc}
					{#await getDownloadURL(ref(storage, doc.fullPath)) then s}
						<div class="d-flex align-items-center justify-content-end bg-light rounded-1 p-1">
							<div class="ps-2 pe-3 text-dark">{doc.name}</div>
							<a
								class="btn btn-sm btn-light border-0 text-dark"
								title="Скачать файл"
								href={s}
								download>
								<i class="fa-solid fa-cloud-arrow-down" />
							</a>
							<button
								class="btn btn-sm btn-light border-0 text-dark"
								title="Скопировать url"
								on:click={() => {
									navigator.clipboard.writeText(s).then(s => {});
								}}><i class="fa-solid fa-copy" /></button>
							<button
								class="btn btn-sm btn-light border-0 text-danger"
								title="Удалить"
								on:click={() => {
									deleteObject(ref(storage, `/${documentsFolder}/${doc.name}`));
									getDocuments();
								}}>
								<i class="fa-solid fa-xmark" />
							</button>
						</div>
					{/await}
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	a.active {
		background: var(--bs-dark) !important;
		color: var(--bs-light) !important;
	}
</style>
