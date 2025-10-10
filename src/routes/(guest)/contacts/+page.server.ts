import type { IContacts } from '$lib/models/Contacts';

export async function load({ fetch }) {
	let contacts: IContacts = await fetch('/api/contacts').then(v => v.json());
	return {
		contacts: contacts
	};
}
