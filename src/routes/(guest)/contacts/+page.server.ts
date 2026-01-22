import type { IContacts } from '$lib/models/Contacts';
import { db } from '$lib/settings/firebase';
import { get, ref } from 'firebase/database';

export async function load({ fetch }) {
	let contacts: IContacts = await (await get(ref(db, '/contacts'))).val();
	return {
		contacts: contacts
	};
}
