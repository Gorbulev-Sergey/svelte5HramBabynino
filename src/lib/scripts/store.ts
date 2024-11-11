import { Tag } from '$lib/models/Tag';
import { Month } from '$lib/models/schedule/Month';
import { writable, type Writable } from 'svelte/store';
import { get, onValue, ref } from 'firebase/database';
import { db } from './firebase';
import type { Snippet } from 'svelte';

// Для сохранения темы оформления (светлой или тёмной)
export let theme = writable('');
export let isSystemTheme = writable(true);

// Для работы фильтра публикаций на странице администрирования
export let adminPostsFilters = writable({
	published: true,
	pinned: false,
	newFirst: true,
	tag: new Tag('главное', 'Главное')
});

// Для работы расписания богослужений
export let scheduleMonth = writable(new Month(new Date().getMonth() + 1, new Date().getFullYear()));

// Для работы публикаций, чтобы публикации показывались порционно
// по showedPostsStep раз и для каждого тега отдельно
export let showedPostsStep = 6;

export let showedPostsLength = writable<Map<string, number>>(new Map());
onValue(ref(db, '/tags'), s => {
	let _tags = Object.values(s.val());
	let m = new Map();
	_tags.forEach(v => m.set(v.name, showedPostsStep));
	showedPostsLength.set(m);
});

/**
 * Для работы фотоальбомов *
 * searchAlbums - строка поиска альбомов
 * countAlbumsColumns - Количество колонок для альбомов
 * countAlbumsOnPage - Количество альбомов на каждой странице
 * countPagesForShow - Количество страниц для отображения (изначально 1-на)
 */
export let searchAlbumsString = writable('');
export let countAlbumsColumns = writable(2);
export let countAlbumsOnPage = writable(8);
export let countPagesForShow = writable(1);
export let isNewAlbumsFirst = writable(true);

// Пользователь, который вошёл в систему
export let userSigned = writable({});

// Для работы с всплывающими сообщениями
export let alerts: Writable<String[]> = writable([]);

// Дополнительная панель в макете
export let Header: Writable<Snippet> | null = writable();

// Для того, чтобы при обновлении поста в админпанели происходил перерендеринг всех постов
export let isPostUpdated = writable<boolean>(false);
