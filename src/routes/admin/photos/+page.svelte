<script>
	import { goto } from '$app/navigation';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import Album from '$lib/components/photos/Album.svelte';
	import { db } from '$lib/scripts/firebase';
	import { onValue, ref, remove } from 'firebase/database';
	import { onMount } from 'svelte';

	let albums = new Object();
	onMount(async () => {
		onValue(ref(db, '/photos'), s => {
			if (s.exists()) albums = s.val();
		});
	});
</script>

<PageTitle title="Фотографии">
	<div slot="navigation">
		<button class="btn btn-dark text-light" on:click={() => goto(`/admin/photos/create`)}>Создать</button>
	</div>
</PageTitle>

<div class="row row-cols-1 row-cols-md-3 g-3">
	{#each Object.entries(albums).sort(([k1, v1], [k2, v2]) => new Date(v2.date).getTime() - new Date(v1.date).getTime()) as [uid, album]}
		<div class="col">
			<Album {uid} {album}>
				<div slot="navigation" class="flex-grow-1">
					<div class="d-flex align-items-center justify-content-between m-2">
						<!-- svelte-ignore a11y-invalid-attribute -->
						<a
							href="#"
							title="Скопировать путь к альбому: /fullscreen/photos/{uid}"
							class="btn btn-sm btn-light bg-light bg-opacity-75 border-0 text-dark"
							on:click|stopPropagation={() => {
								navigator.clipboard.writeText(`/fullscreen/photos/${uid}`);
							}}>
							<span class="badge bg-dark text-light">id:</span>
							{uid}
						</a>
						<div class="d-flex justify-content-end align-items-start gap-1">
							<button
								class="btn btn-sm btn-dark"
								on:click|stopPropagation={() => {
									goto(`/admin/photos/edit/${uid}`);
								}}>
								<i class="fa-solid fa-pencil" />
							</button>
							<button class="btn btn-sm btn-dark" on:click|stopPropagation={async () => remove(ref(db, `/photos/${uid}`))}><i class="fa-solid fa-trash text-danger" /></button>
						</div>
					</div>
				</div>
			</Album>
		</div>
	{/each}
</div>
