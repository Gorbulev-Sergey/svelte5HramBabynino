import { Tag } from '$lib/models/Tag';
import type { Snippet } from 'svelte';

export enum EFixedUnfixed {
	'закреплённые',
	'незакреплённые',
	'закреплённые и незакреплённые'
}

export let SETTINGS = $state({
	ADMIN: {
		Header: {} as Snippet<[]>,
		schedule: { date: new Date().toISOString().slice(0, 7) },
		isCompactMode: false,
		posts: {
			columns: { now: 4, max: 6 },
			step: 4,
			pages: 1,
			showedPosts: { главное: 4 } as { [key: string]: number },
			filters: {
				published: true,
				pinned: false,
				isNewFirst: true,
				tag: Tag('главное', 'Главное'),
				fixedUnfixed: EFixedUnfixed['закреплённые и незакреплённые']
			}
		},
		albums: {
			columns: { now: 4, max: 6 },
			step: 8,
			pages: 2,
			filters: {
				isNewFirst: true
			}
		},
		vk: {
			accessToken:
				'vk1.a.Qm1LwHfDS-mkBajEJj6ZAUnzeuQqVsiSZjH6u4ZlwrxLOJQ1Yifo814Eauhj--io47OlLWEqUVACDxvemHVeYvasnxJtTNN1hVOM98_09Ji7BUcQ4EE5VFfbnQnbQhb-kfkAim-KIrz4VOUNY_Sdhg4UTnkmZngU_ESKBTDuZWvkeouG17PjnwYfCTy8p2v4ts2I8ECfxSM8iY2Hc86Dpg'
		}
	},
	albums: {
		columns: 3,
		step: 6,
		pages: 1,
		filters: {
			search: '',
			isNewFirst: true
		}
	},
	posts: {
		columns: 3,
		step: 6,
		pages: 1,
		showedPosts: { главное: 6 } as { [key: string]: number }
	},
	theme: {
		theme: 'light',
		isSystem: true
	},
	userSigned: {},
	alerts: []
});
