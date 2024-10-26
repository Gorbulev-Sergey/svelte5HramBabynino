import type { Contacts } from '$lib/models/Contacts';

export async function load({ fetch }) {
	let response = await fetch('/api/contacts');
	let contacts = await response.json();
	return {
		contacts: contacts as Contacts
	};
}
