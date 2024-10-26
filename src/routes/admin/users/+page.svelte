<script lang="ts">
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { User } from '$lib/models/admin/User';
	import { db } from '$lib/scripts/firebase';
	import { alerts } from '$lib/scripts/writableData';
	import { onValue, ref, remove, set } from 'firebase/database';
	import { onMount } from 'svelte';

	let users: [String, User][] = [];
	let newUser = new User();

	onMount(async () => {
		onValue(ref(db, '/users'), s => {
			if (s.exists()) {
				users = Object.entries(s.val()) as [string, User][];
			}
		});
	});
</script>

<PageTitle title="Пользователи">
	<div slot="navigation">
		<div class="input-group">
			<div class="p-2 bg-light rounded-start border">Новый пользователь:</div>
			<input class="form-control" bind:value={newUser.uid} placeholder="uid" />
			<input class="form-control" bind:value={newUser.email} placeholder="email" />
			<input class="form-control" bind:value={newUser.role.name} placeholder="название роли" />
			<button
				class="btn btn-dark text-light"
				on:click={async () => {
					set(ref(db, `users/${newUser.uid}`), newUser);
					newUser = new User();
				}}>Сохранить</button>
		</div>
	</div>
</PageTitle>

<div class="p-1 d-flex flex-column gap-0">
	{#each users as [uid, user], i}
		<div class="d-flex align-items-center justify-content-between hover px-2 py-1 {i < users.length - 1 ? 'border-bottom' : ''} ">
			<div>
				<span class="badge bg-dark text-light me-2">{i + 1}</span>
				<span class="text-dark">
					<span class="badge bg-light text-dark me-1">email:</span>{user.email},
					<span class="badge bg-light text-dark me-1">роль:</span>{user.role.name},
					<span class="badge bg-light text-dark me-1">uid:</span>{user.uid}
				</span>
			</div>
			<div class="d-flex align-items-center gap-1">
				<button class="btn btn-sm btn-light text-dark" title="Редактировать пользователя" on:click={() => {}}>
					<i class="fa-solid fa-pencil" />
				</button>
				<button
					class="btn btn-sm btn-light"
					title="Удалить пользователя"
					on:click={async () => {
						remove(ref(db, `/users/${uid}`)).then(r => ($alerts = [...$alerts, `Пользователь с email ${user.email} удалён!`]));
					}}>
					<i class="fa-solid fa-trash text-danger" />
				</button>
			</div>
		</div>
	{/each}
</div>

<style>
	.hover:hover {
		background-color: var(--bs-light);
		cursor: normal;
	}
</style>
