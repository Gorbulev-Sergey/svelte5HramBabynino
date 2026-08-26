<script lang="ts">
	import type { Album as _Album } from '$lib/models/photos/Album';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import Album from '$lib/components/photos/Album.svelte';
	import Container from '$lib/components/Container.svelte';
	import { SETTINGS } from '$lib/settings/settings.svelte.js';

	let { data } = $props();
	let albums = $derived(data.albums);
	let title = 'Фотографии';
	let description = 'Фотографии храма и событий нашего прихода';
	let keywords = $derived(`бабынино, храм, храм бабынино, ${title}, ${description}`);

	/*1-ый фильтр) Массив альбомов, отфильтрованных по строке поиска*/
	let searchAlbums = $derived(
		albums.filter(a =>
			a[1].title.toLowerCase().includes(SETTINGS.albums.filters.search.toLowerCase())
		)
	);
	/*2-ый фильтр) Сортируем альбомы по дате*/
	let albumsByDate = $derived(() =>
		SETTINGS.albums.filters.isNewFirst
			? searchAlbums.sort(
					(a1, a2) => new Date(a2[1].date).getTime() - new Date(a1[1].date).getTime()
				)
			: searchAlbums.sort(
					(a1, a2) => new Date(a1[1].date).getTime() - new Date(a2[1].date).getTime()
				)
	);
	/*3-ий фильтр) Вывод альбомов в зависимости от переключателя количества альбомов на странице и количества страниц для отображения*/
	let albumsByCountOnPage = $derived(
		albumsByDate().slice(0, SETTINGS.albums.step * SETTINGS.albums.pages)
	);
	/*Страниц всего*/
	let getPagesCount = $derived(Math.ceil(searchAlbums.length / SETTINGS.albums.columns));
</script>

<Container>
	<PageTitle {title} {description} {keywords} _class="mb-4">
		<div
			class="d-flex flex-wrap flex-sm-nowrap align-items-center justify-content-end gap-lg-3 gap-2">
			<!-- Строка поиска -->
			<div class="input-group input-group-sm border-0 rounded flex-nowrap">
				<input
					class="form-control bg-light text-dark border-0"
					bind:value={SETTINGS.albums.filters.search}
					placeholder="Поиск фотоальбомов" />
				<button
					aria-label=""
					class="btn btn-light border-0"
					onclick={() => (SETTINGS.albums.filters.search = '')}
					><i class="fa-solid fa-xmark"></i></button>
			</div>
			<div class="d-flex align-items-center gap-1">
				<div class="small text-dark">сначала:</div>
				<button
					aria-label=""
					class="btn btn-sm btn-dark"
					onclick={() => (SETTINGS.albums.filters.isNewFirst = !SETTINGS.albums.filters.isNewFirst)}
					>{SETTINGS.albums.filters.isNewFirst ? 'новые' : 'старые'}</button>
			</div>
		</div>
	</PageTitle>

	<div class="d-flex flex-column gap-3">
		<div
			class="row row-cols-1 row-cols-md-2 row-cols-lg-{SETTINGS.albums
				.columns} g-3 justify-content-center">
			{#each albumsByCountOnPage as [uid, album]}
				<div class="col">
					<Album {uid} {album} />
				</div>
			{/each}
		</div>
		{#if SETTINGS.albums.pages < getPagesCount}
			<div class="d-flex justify-content-center w-100 mt-3">
				<button
					class="btn bg-secondary bg-opacity-10 text-bg-light border-0 px-3"
					onclick={() => SETTINGS.albums.pages++}>Загрузить ещё...</button>
			</div>
		{/if}
	</div>
</Container>
