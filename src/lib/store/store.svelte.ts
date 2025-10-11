import { type Snippet } from 'svelte';

interface ISettings {
	scheduleDate: string;
	vkAccessToken: string;
	Header: Snippet | null;
}

/**
 * @property scheduleDate - Дата выбранная в календаре *
 * @property Header - Дополнительная панель в макете *
 */
export let SETTINGS: ISettings = $state({
	scheduleDate: new Date().toISOString().slice(0, 7),
	vkAccessToken:
		'vk1.a.xm0YSBut11g_tmJiIuGCV635mkYyBT_zGWun5haYma6SXcO92Npisia5FqCCl6FH4tFwvFRp0XLfU7a1YxKeZBQ02fk-cF4ej2GG0MUyY0DXOjc7OSZOzoBQ3mARjnzGa7-XKrSVg22c-JoBiGtaVuyphGEM6JcggO7B1sRLnEDKisNdVhkQRnBMYe8bg707VO2ujGHwyqGqhVLORupnkA',
	Header: null
});
