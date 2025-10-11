import { Tag } from '$lib/models/Tag';
import { type Snippet } from 'svelte';
import { writable, type Writable } from 'svelte/store';

// Дополнительная панель в макете
//export let Header: Writable<Snippet> | null = writable();

// Для сохранения темы оформления (светлой или тёмной)
export let theme = writable('');
export let isSystemTheme = writable(true);

export enum EFixedUnfixed {
	'закреплённые',
	'незакреплённые',
	'закреплённые и незакреплённые'
}

// Для работы фильтра публикаций на странице администрирования
export let adminPostsFilters = writable({
	published: true,
	pinned: false,
	newFirst: true,
	tag: Tag('главное', 'Главное'),
	fixedUnfixed: EFixedUnfixed['закреплённые и незакреплённые']
});

// Для работы расписания богослужений
//export let scheduleMonth = writable(new Month(new Date().getMonth() + 1, new Date().getFullYear()));

// Для работы публикаций, чтобы публикации показывались порционно
// по showedPostsStep раз и для каждого тега отдельно
export let showedPostsStep = 6;

interface IMap {
	[key: string]: number;
}
export let showedPostsLength = writable<IMap>({ главное: showedPostsStep });

/**
 * Для работы фотоальбомов *
 * searchAlbums - строка поиска альбомов
 * countAlbumsColumns - Количество колонок для альбомов
 * countAlbumsOnPage - Количество альбомов на каждой странице
 * countPagesForShow - Количество страниц для отображения (изначально 1-на)
 */
export let searchAlbumsString = writable('');
export let countAlbumsColumns = writable(3);
export let countAlbumsOnPage = writable(6);
export let countPagesForShow = writable(1);
export let isNewAlbumsFirst = writable(true);

// Пользователь, который вошёл в систему
export let userSigned = writable({});

// Для работы с всплывающими сообщениями
export let alerts: Writable<String[]> = writable([]);

// Для того, чтобы при обновлении поста в админпанели происходил перерендеринг всех постов
export let isPostUpdated = writable<boolean>(false);

// Для компактного/полного размера админ-панели
export let isAdminCompactMode = writable(false);

// Количестов постов на админ странице
export let countPostOnAdminPage = writable(3);

// Количестов альбомов на админ странице
export let countAlbumOnAdminPage = writable(3);

// Количестов фотографий на админ странице хранилища
export let countPhotoOnAdminPage = writable(3);
