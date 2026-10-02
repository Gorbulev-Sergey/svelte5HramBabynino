<script lang="ts">
	import { type IUser, User as _User } from '$lib/models/admin/User';
	import { auth, db } from '$lib/settings/firebase';
	import { onAuthStateChanged, type User } from 'firebase/auth';
	import { onValue, ref } from 'firebase/database';
	import { onMount, type Snippet } from 'svelte';

	interface IProps {
		children?: Snippet;
		notAuth?: Snippet;
	}
	let { children, notAuth }: IProps = $props();

	let currentUser = $state<User>({} as User);
	let users: IUser[] = $state([]);

	onMount(async () => {
		onAuthStateChanged(auth, user => {
			if (user) {
				currentUser = user;
				// Список пользователей нужен только авторизованным, гости не обращаются к Firebase
				onValue(ref(db, '/users'), s => {
					if (s.exists()) {
						users = Object.values(s.val());
					}
				});
			}
		});
	});
</script>

{#if currentUser.uid}
	{#if users.find(u => u.uid == currentUser.uid)?.role.name == 'админ' || users.find(u => u.uid == currentUser.uid)?.role.name == 'редактор'}
		{@render children?.()}
	{/if}
{:else}
	{@render notAuth?.()}
{/if}
