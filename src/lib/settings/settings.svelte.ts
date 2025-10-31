import { Tag } from '$lib/models/Tag';

export enum EFixedUnfixed {
	'закреплённые',
	'незакреплённые',
	'закреплённые и незакреплённые'
}
interface IMap {
	[key: string]: number;
}

export let SETTINGS = $state({
	ADMIN: {
		Header: null,
		schedule: { date: new Date().toISOString().slice(0, 7) },
		isCompactMode: false,
		posts: {
			columns: 4,
			step: 8,
			filters: {
				published: true,
				pinned: false,
				newFirst: true,
				tag: Tag('главное', 'Главное'),
				fixedUnfixed: EFixedUnfixed['закреплённые и незакреплённые']
			}
		},
		albums: {
			columns: 4,
			step: 8
		}
	},
	theme: {
		theme: 'light',
		isSystem: true
	},
	vkAccessToken:
		'vk1.a.xm0YSBut11g_tmJiIuGCV635mkYyBT_zGWun5haYma6SXcO92Npisia5FqCCl6FH4tFwvFRp0XLfU7a1YxKeZBQ02fk-cF4ej2GG0MUyY0DXOjc7OSZOzoBQ3mARjnzGa7-XKrSVg22c-JoBiGtaVuyphGEM6JcggO7B1sRLnEDKisNdVhkQRnBMYe8bg707VO2ujGHwyqGqhVLORupnkA',
	userSigned: {},
	albums: {
		columns: 3,
		step: 6,
		pages: 2,
		filters: {
			search: '',
			isNewFirst: true
		}
	},
	posts: {
		columns: 3,
		step: 6,

		showedMap: { главное: 6 }
	}
});
