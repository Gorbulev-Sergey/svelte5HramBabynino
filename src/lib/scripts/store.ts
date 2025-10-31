import { Tag } from '$lib/models/Tag';
import { writable, type Writable } from 'svelte/store';

export enum EFixedUnfixed {
	'закреплённые',
	'незакреплённые',
	'закреплённые и незакреплённые'
}

// interface IMap {
// 	[key: string]: number;
// }
// export let showedPostsLength = writable<IMap>({ главное: showedPostsStep });

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

// Для работы с всплывающими сообщениями
export let alerts: Writable<String[]> = writable([]);

// Для того, чтобы при обновлении поста в админпанели происходил перерендеринг всех постов
export let isPostUpdated = writable<boolean>(false);

// Количестов альбомов на админ странице
export let countAlbumOnAdminPage = writable(3);

// Количестов фотографий на админ странице хранилища
export let countPhotoOnAdminPage = writable(3);
