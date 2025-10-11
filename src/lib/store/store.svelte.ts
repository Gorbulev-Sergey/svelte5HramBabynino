import { type Snippet } from 'svelte';

interface ISettings {
	scheduleDate: string;
	Header: Snippet | null;
}

/**
 * @property scheduleDate - Дата выбранная в календаре *
 * @property Header - Дополнительная панель в макете *
 */
export let SETTINGS: ISettings = $state({
	scheduleDate: new Date().toISOString().slice(0, 7),
	Header: null
});
