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
			columns: { now: 3, max: 6 },
			step: 6,
			pages: 2,
			filters: {
				isNewFirst: true
			}
		},
		vk: {
			accessToken:
				'vk1.a.OVGnwTrCOvT9_CAESGGIu8-qdoX-7nGzg5AEDa6l9njK9IIo9id_SnbGnhVV0Ur86YNvj47qRTCXLdHwpJMa9EDfa20e0Dq797jnfrHNASr3_-RCPpbaMQtot44YfdpeaKHQvCUi3gHm_IkUJ2exm9fZWLAY6Evi60ncRXK3H5aqjS2prvsD6HGR4OZ-D_WF8ShpXQrDkJJxnj6g67FWcg'
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
		columns: 4,
		step: 8,
		pages: 1,
		showedPosts: { главное: 8 } as { [key: string]: number }
	},
	theme: {
		theme: 'light',
		isSystem: true
	},
	userSigned: {},
	alerts: []
});
