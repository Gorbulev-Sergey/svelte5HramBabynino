import type { Contacts } from '$lib/models/Contacts';

export async function load({ fetch }) {
	let contacts = async (): Promise<Contacts> => await (await fetch('/api/contacts')).json();
	return {
		contacts: await contacts()
	};
}
