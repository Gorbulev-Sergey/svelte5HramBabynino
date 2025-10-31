<script lang="ts">
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { User, type IUser } from '$lib/models/admin/User';
	import { db } from '$lib/scripts/firebase';
	import { alerts } from '$lib/scripts/store';
	import { SETTINGS } from '$lib/settings/settings.svelte';
	import { onValue, ref, remove, set } from 'firebase/database';
	import { onDestroy, onMount } from 'svelte';

	let users: [String, IUser][] = $state([]);
	let newUser = $state<IUser>(User());
	let isCreateUserModalShow = $state(false);

	onMount(async () => {
		SETTINGS.ADMIN.Header = header;
		onValue(ref(db, '/users'), s => {
			if (s.exists()) {
				users = Object.entries(s.val()) as [string, IUser][];
			}
		});
	});
</script>

{#snippet header()}
	<PageTitle title="Пользователи">
		<button class="btn btn-dark text-light" onclick={() => (isCreateUserModalShow = true)}
			>Создать</button>
	</PageTitle>
{/snippet}

<div class="d-flex flex-column gap-0">
	{#each users as [uid, user], i}
		<div
			class="d-flex align-items-center justify-content-between hover px-2 py-1 {i < users.length - 1
				? 'border-bottom'
				: ''} ">
			<div>
				<span class="badge bg-dark text-light me-2">{i + 1}</span>
				<span class="text-dark">
					<span class="badge bg-light text-dark me-1">email:</span>{user.email},
					<span class="badge bg-light text-dark me-1">роль:</span>{user.role.name},
					<span class="badge bg-light text-dark me-1">uid:</span>{user.uid}
				</span>
			</div>
			<div class="d-flex align-items-center gap-1">
				<button
					aria-label=""
					class="btn btn-sm btn-light text-dark"
					title="Редактировать пользователя">
					<i class="fa-solid fa-pencil"></i>
				</button>
				<button
					aria-label=""
					class="btn btn-sm btn-light"
					title="Удалить пользователя"
					onclick={async () => {
						remove(ref(db, `/users/${uid}`)).then(
							r => ($alerts = [...$alerts, `Пользователь с email ${user.email} удалён!`])
						);
					}}>
					<i class="fa-solid fa-trash text-danger"></i>
				</button>
			</div>
		</div>
	{/each}
</div>

<Modal
	isModalShow={isCreateUserModalShow}
	onClose={() => {
		newUser = User();
	}}>
	<h5 class="text-dark">Создать пользователя</h5>
	<div class="d-flex flex-column gap-1">
		<input class="form-control" bind:value={newUser.uid} placeholder="uid" />
		<input class="form-control" bind:value={newUser.email} placeholder="email" />
		<input class="form-control" bind:value={newUser.role.name} placeholder="название роли" />
		<div class="d-flex justify-content-end gap-1">
			<button
				class="btn btn-light text-dark"
				onclick={() => {
					newUser = User();
					isCreateUserModalShow = false;
				}}>Отмена</button>
			<button
				class="btn btn-dark text-light"
				onclick={async () => {
					set(ref(db, `users/${newUser.uid}`), newUser).then(v => {
						isCreateUserModalShow = false;
					});
				}}>Создать</button>
		</div>
	</div>
</Modal>

<style>
	.hover:hover {
		background-color: var(--bs-light);
		cursor: normal;
	}
</style>
