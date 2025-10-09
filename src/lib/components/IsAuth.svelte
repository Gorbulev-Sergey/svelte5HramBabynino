<script lang="ts">
	import { type IUser, User as _User } from '$lib/models/admin/User';
	import { auth, db } from '$lib/scripts/firebase';
	import { onAuthStateChanged, type User } from 'firebase/auth';
	import { onValue, ref } from 'firebase/database';
	import { onMount } from 'svelte';

	let currentUser: IUser = _User();
	let users: IUser[] = [];

	onMount(async () => {
		onAuthStateChanged(auth, user => {
			if (user) currentUser = user;
		});
		onValue(ref(db, '/users'), s => {
			if (s.exists()) {
				users = Object.values(s.val());
			}
		});
	});
</script>

{#if currentUser}
	{#if users.find(u => u.uid == currentUser.uid)?.role.name == 'админ' || users.find(u => u.uid == currentUser.uid)?.role.name == 'редактор'}
		<slot />
	{/if}
{:else}
	<slot name="notAuth" />
{/if}
