<script lang="ts">
	import { goto } from '$app/navigation';
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import Album from '$lib/components/photos/Album.svelte';
	import type { IAlbum } from '$lib/models/photos/Album.js';
	import { db } from '$lib/settings/firebase';
	import { SETTINGS } from '$lib/settings/settings.svelte';
	import { get, onValue, ref, remove } from 'firebase/database';
	import { onMount } from 'svelte';

	let albums: [string, IAlbum][] = $state([]);
	let filteredAlbums = $derived.by(() =>
		[...albums]
			.sort(([k1, v1], [k2, v2]) =>
				SETTINGS.ADMIN.albums.filters.isNewFirst
					? new Date(v2.date).getTime() - new Date(v1.date).getTime()
					: new Date(v1.date).getTime() - new Date(v2.date).getTime()
			)
			.slice(0, SETTINGS.ADMIN.albums.columns.now * SETTINGS.ADMIN.albums.pages)
	);

	onMount(async () => {
		SETTINGS.ADMIN.Header = header;
		onValue(ref(db, '/photos'), s => {
			if (s.exists()) {
				albums = Object.entries(s.val());
			}
		});
	});

	let downloadImage = async (src: string, i: number) => {
		fetch(src)
			.then(r => r.blob())
			.then(r => {
				let link = document.createElement('a');
				link.href = URL.createObjectURL(r);
				link.download = `photo${i}.jpg`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			});
	};
</script>

{#snippet header()}
	<PageTitle title="Фотоальбомы">
		<div class="flex-grow-1 d-flex align-items-center gap-1">
			<button
				class="btn btn-sm btn-dark text-light"
				onclick={() => {
					SETTINGS.ADMIN.albums.columns.now == SETTINGS.ADMIN.albums.columns.max
						? (SETTINGS.ADMIN.albums.columns.now = 1)
						: SETTINGS.ADMIN.albums.columns.now++;
					localStorage.setItem(
						'SETTINGS.ADMIN.albums.columns.now',
						String(SETTINGS.ADMIN.albums.columns.now)
					);
				}}>
				<span>колонки</span>
				<span class="badge bg-light text-dark ms-1">{SETTINGS.ADMIN.albums.columns.now}</span>
			</button>
			<button
				class="btn btn-sm btn-dark text-light"
				onclick={() =>
					(SETTINGS.ADMIN.albums.filters.isNewFirst = !SETTINGS.ADMIN.albums.filters.isNewFirst)}
				>сначала {SETTINGS.ADMIN.albums.filters.isNewFirst ? 'новые' : 'старые'}
			</button>
		</div>
		<div class="me-2">
			Всего <span class="badge bg-white text-dark">{albums.length} альбомов</span>
		</div>
		<button class="btn btn-dark text-light" onclick={() => goto(`/admin/photos/create`)}>
			Создать
		</button>
	</PageTitle>
{/snippet}

<div class="row row-cols-1 row-cols-md-{SETTINGS.ADMIN.albums.columns.now} g-3">
	{#each filteredAlbums as [uid, album]}
		<div class="col">
			<Album {uid} {album}>
				<div slot="navigation" class="flex-grow-1">
					<div class="d-flex align-items-center justify-content-between flex-wrap gap-1 m-2">
						<a
							href="#"
							title="Скопировать путь к альбому: /fullscreen/photos/{uid}"
							class="btn btn-sm btn-light bg-light bg-opacity-75 border-0 text-dark"
							onclick={e => {
								e.stopPropagation();
								navigator.clipboard.writeText(`/fullscreen/photos/${uid}`);
							}}>
							<span class="badge bg-dark text-light">id:</span>
							{uid}
						</a>
						<div class="d-flex justify-content-end align-items-start gap-1">
							<button
								aria-label="Скачать фотоальбом"
								title="Скачать фотоальбом"
								class="btn btn-sm btn-dark"
								onclick={e => {
									e.stopPropagation();
									get(ref(db, `/photos/${uid}`)).then(s => {
										if (s.exists()) {
											(s.val() as IAlbum).photos.forEach((ph, i) => {
												downloadImage(ph.url, i + 1);
											});
										}
									});
								}}>
								<i class="fa-solid fa-cloud-arrow-down"></i>
							</button>
							<button
								aria-label="Редактировать фотоальбом"
								title="Редактировать фотоальбом"
								class="btn btn-sm btn-dark"
								onclick={e => {
									e.stopPropagation();
									goto(`/admin/photos/edit/${uid}`);
								}}>
								<i class="fa-solid fa-pencil"></i>
							</button>
							<button
								aria-label="Удалить фотоальбом"
								title="Удалить фотоальбом"
								class="btn btn-sm btn-dark"
								onclick={async e => {
									e.stopPropagation();
									remove(ref(db, `/photos/${uid}`));
								}}>
								<i class="fa-solid fa-trash text-danger"></i>
							</button>
						</div>
					</div>
				</div>
			</Album>
		</div>
	{/each}
</div>

{#if SETTINGS.ADMIN.albums.pages < albums.length / SETTINGS.ADMIN.albums.columns.now}
	<button
		class="btn btn-light text-dark w-100 mt-3"
		onclick={() => (SETTINGS.ADMIN.albums.pages += 2)}>Загрузить ещё...</button>
{/if}
