<script lang="ts">
	import type { Album as _Album } from '$lib/models/photos/Album';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import Album from '$lib/components/photos/Album.svelte';
	import { countAlbumsColumns, countAlbumsOnPage, countPagesForShow, searchAlbumsString as search, isNewAlbumsFirst } from '$lib/scripts/writableData.js';
	import Container from '$lib/components/Container.svelte';

	export let data;
	$: albums = data.albums;
	let title = 'Фотографии';
	let description = 'Фотографии храма и событий нашего прихода';
	$: keywords = `бабынино, храм, храм бабынино, ${title}, ${description}`;

	/*Страниц всего*/
	$: getPagesCount = () => {
		return Math.ceil(searchAlbums.length / $countAlbumsOnPage);
	};

	/*1-ый фильтр) Массив альбомов, отфильтрованных по строке поиска*/
	$: searchAlbums = albums.filter(a => a[1].title.toLowerCase().includes($search.toLowerCase()));
	/*2-ый фильтр) Сортируем альбомы по дате*/
	$: albumsByDate = $isNewAlbumsFirst
		? searchAlbums.sort((a1, a2) => new Date(a2[1].date).getTime() - new Date(a1[1].date).getTime())
		: searchAlbums.sort((a1, a2) => new Date(a1[1].date).getTime() - new Date(a2[1].date).getTime());
	/*3-ий фильтр) Вывод альбомов в зависимости от переключателя количества альбомов на странице и количества страниц для отображения*/
	$: albumsByCountOnPage = albumsByDate.slice(0, $countAlbumsOnPage * $countPagesForShow);
</script>

<Container>
	<PageTitle {title} {description} {keywords} _class="mb-4">
		<div slot="navigation" class="d-flex flex-wrap flex-sm-nowrap align-items-center justify-content-end gap-lg-3 gap-2">
			<!-- Строка поиска -->
			<div class="input-group input-group-sm border-0 rounded flex-nowrap">
				<input class="form-control bg-light text-dark border-0" bind:value={$search} placeholder="Поиск фотоальбомов" />
				<button class="btn btn-light border-0" on:click={() => ($search = '')}><i class="fa-solid fa-xmark"></i></button>
			</div>
			<div class="d-flex align-items-center gap-1">
				<div class="small text-dark">сначала:</div>
				<button class="btn btn-sm btn-dark" on:click={() => ($isNewAlbumsFirst = !$isNewAlbumsFirst)}>{$isNewAlbumsFirst ? 'новые' : 'старые'}</button>
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
		{#if $countPagesForShow < getPagesCount()}
			<button class="btn btn-light" on:click={() => $countPagesForShow++}>Загрузить ещё...</button>
		{/if}
	</div>
</Container>
