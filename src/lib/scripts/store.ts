import { Tag } from '$lib/models/Tag';
import { writable, type Writable } from 'svelte/store';

// interface IMap {
// 	[key: string]: number;
// }
// export let showedPostsLength = writable<IMap>({ главное: showedPostsStep });

// Для работы с всплывающими сообщениями
export let alerts: Writable<String[]> = writable([]);

// Количестов альбомов на админ странице
export let countAlbumOnAdminPage = writable(3);

// Количестов фотографий на админ странице хранилища
export let countPhotoOnAdminPage = writable(3);
