<script lang="ts">
	import { goto } from '$app/navigation';
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import Album from '$lib/components/photos/Album.svelte';
	import { db } from '$lib/scripts/firebase';
	import { countAlbumOnAdminPage } from '$lib/scripts/store';
	import { SETTINGS } from '$lib/store/store.svelte.js';
	import { ref, remove } from 'firebase/database';
	import { onDestroy } from 'svelte';

	let { data } = $props();
	let albums = $derived(data.albums);
	SETTINGS.Header = header;
</script>

{#snippet header()}
	<PageTitle title="Фотографии">
		<div class="flex-grow-1 d-flex align-items-center">
			<button
				class="btn btn-sm btn-dark text-light"
				onclick={() => {
					if ($countAlbumOnAdminPage == 5) {
						$countAlbumOnAdminPage = 1;
					} else $countAlbumOnAdminPage++;
					localStorage.setItem('countAlbumOnAdminPage', String($countAlbumOnAdminPage));
				}}>
				<span>колонки</span>
				<span class="badge bg-light text-dark ms-1">{$countAlbumOnAdminPage}</span>
			</button>
		</div>
		<button class="btn btn-dark text-light" onclick={() => goto(`/admin/photos/create`)}>
			Создать
		</button>
	</PageTitle>
{/snippet}

<div class="row row-cols-1 row-cols-md-{$countAlbumOnAdminPage} g-3">
	{#each albums.sort(([k1, v1], [k2, v2]) => new Date(v2.date).getTime() - new Date(v1.date).getTime()) as [uid, album]}
		<div class="col">
			<Album {uid} {album}>
				<div slot="navigation" class="flex-grow-1">
					<div class="d-flex align-items-center justify-content-between m-2">
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
								aria-label=""
								class="btn btn-sm btn-dark"
								onclick={e => {
									e.stopPropagation();
									goto(`/admin/photos/edit/${uid}`);
								}}>
								<i class="fa-solid fa-pencil"></i>
							</button>
							<button
								aria-label=""
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
