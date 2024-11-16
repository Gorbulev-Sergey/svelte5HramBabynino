import type { Contacts } from '$lib/models/Contacts';

export async function load({ fetch }) {
	let contacts: Contacts = await fetch('/api/contacts').then(v => v.json());
	return {
		contacts: contacts
	};
}
