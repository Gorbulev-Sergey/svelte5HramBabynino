<script lang="ts">
	import type { Album as _Album } from '$lib/models/photos/Album';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import Album from '$lib/components/photos/Album.svelte';
	import {
		countAlbumsColumns,
		countAlbumsOnPage,
		countPagesForShow,
		searchAlbumsString as search,
		isNewAlbumsFirst
	} from '$lib/scripts/store.js';
	import Container from '$lib/components/Container.svelte';

	let { data } = $props();
	let albums = $derived(data.albums);
	let title = 'Фотографии';
	let description = 'Фотографии храма и событий нашего прихода';
	let keywords = `бабынино, храм, храм бабынино, ${title}, ${description}`;

	/*1-ый фильтр) Массив альбомов, отфильтрованных по строке поиска*/
	let searchAlbums = $derived(
		albums.filter(a => a[1].title.toLowerCase().includes($search.toLowerCase()))
	);
	/*2-ый фильтр) Сортируем альбомы по дате*/
	let albumsByDate = $derived(() =>
		$isNewAlbumsFirst
			? searchAlbums.sort(
					(a1, a2) => new Date(a2[1].date).getTime() - new Date(a1[1].date).getTime()
				)
			: searchAlbums.sort(
					(a1, a2) => new Date(a1[1].date).getTime() - new Date(a2[1].date).getTime()
				)
	);
	/*3-ий фильтр) Вывод альбомов в зависимости от переключателя количества альбомов на странице и количества страниц для отображения*/
	let albumsByCountOnPage = $derived(
		albumsByDate().slice(0, $countAlbumsOnPage * $countPagesForShow)
	);
	/*Страниц всего*/
	let getPagesCount = $derived(Math.ceil(searchAlbums.length / $countAlbumsOnPage));
</script>

<Container>
	<PageTitle {title} {description} {keywords} _class="mb-4">
		<div
			slot="navigation"
			class="d-flex flex-wrap flex-sm-nowrap align-items-center justify-content-end gap-lg-3 gap-2">
			<!-- Строка поиска -->
			<div class="input-group input-group-sm border-0 rounded flex-nowrap">
				<input
					class="form-control bg-light text-dark border-0"
					bind:value={$search}
					placeholder="Поиск фотоальбомов" />
				<button aria-label="" class="btn btn-light border-0" onclick={() => ($search = '')}
					><i class="fa-solid fa-xmark"></i></button>
			</div>
			<div class="d-flex align-items-center gap-1">
				<div class="small text-dark">сначала:</div>
				<button
					aria-label=""
					class="btn btn-sm btn-dark"
					onclick={() => ($isNewAlbumsFirst = !$isNewAlbumsFirst)}
					>{$isNewAlbumsFirst ? 'новые' : 'старые'}</button>
			</div>
		</div>
	</PageTitle>

	<div class="d-flex flex-column gap-3">
		<div class="row row-cols-1 row-cols-md-{$countAlbumsColumns} g-3">
			{#each albumsByCountOnPage as [uid, album]}
				<div class="col">
					<Album {uid} {album} />
				</div>
			{/each}
		</div>
		{#if $countPagesForShow < getPagesCount}
			<button class="btn btn-light" onclick={() => $countPagesForShow++}>Загрузить ещё...</button>
		{/if}
	</div>
</Container>
