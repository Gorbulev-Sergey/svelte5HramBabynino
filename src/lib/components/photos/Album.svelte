<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Album } from '$lib/models/photos/Album';

	export let uid = '';
	export let album = new Album();
	let hoverEffect = 'bg-opacity-25';
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	id={uid}
	class="img-fluid rounded d-flex flex-column-reverse"
	style="background-image: url({album.cover});
				background-repeat: no-repeat; background-position: center; background-size: cover; min-height:16em; cursor:pointer;"
	on:click={() => {
		if (uid != '' && album.photos.length > 0) {
			goto(`/fullscreen/photos/${uid}?returnTo=${$page.url}#${uid}`);
		}
	}}
	on:mousemove={() => (hoverEffect = 'bg-opacity-75')}
	on:mouseleave={() => (hoverEffect = 'bg-opacity-50')}>
	<div class="d-flex justify-content-between bg-light text-dark {hoverEffect} p-3 rounded-bottom">
		<div>
			<h5 class="mb-0">
				{album.title}
			</h5>
			<small class="text-dark text-opacity-75">{album.description ? album.description : ''}</small>
		</div>
		<div class="d-flex flex-column align-items-end justify-content-between small mt-1">
			{#if album.photos}
				<div class="badge badge-light bg-light text-dark">
					{album.photos.length} фото
				</div>
			{/if}
			{#if album.date}
				<div class="text-danger text-nowrap">
					{new Date(album.date).toLocaleDateString('ru-ru', { day: 'numeric', month: 'long', year: 'numeric' })}
				</div>
			{/if}
		</div>
	</div>
	<slot name="navigation" />
</div>
