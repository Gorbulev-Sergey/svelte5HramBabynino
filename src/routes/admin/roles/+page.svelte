<script lang="ts">
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { Role, type IRole } from '$lib/models/admin/Role';
	import { db } from '$lib/scripts/firebase';
	import { alerts } from '$lib/scripts/store';
	import { SETTINGS } from '$lib/store/store.svelte';
	import { onValue, push, ref, remove, set, update } from 'firebase/database';
	import { onMount } from 'svelte';

	let roles: [string, IRole][] = $state([]);
	let newRole = $state(Role());
	let editedRoleUID = $state('');
	let isRoleEdited = $state(false);
	let modalTitle = $derived(isRoleEdited ? 'Редактировать роль' : 'Создать роль');
	let isModalShow = $state(false);

	onMount(async () => {
		SETTINGS.Header = header;
		onValue(ref(db, '/roles'), s => {
			if (s.exists()) roles = Object.entries(s.val()) as [string, IRole][];
		});
	});
</script>

{#snippet header()}
	<PageTitle title="Роли пользователей">
		<button class="btn btn-dark text-light" onclick={() => (isModalShow = true)}>Создать</button>
	</PageTitle>
{/snippet}

<div class="d-flex flex-column gap-0 text-dark">
	{#each roles as [uid, role], i}
		<div
			class="d-flex align-items-center justify-content-between hover px-2 py-1 {i < roles.length - 1
				? 'border-bottom'
				: ''} ">
			<div>
				<span class="badge bg-dark text-light me-3">{i + 1}</span>
				<span class="badge bg-light text-dark me-1">название:</span>{role.name}
			</div>
			<div class="d-flex align-items-center gap-1">
				<button
					aria-label="редактировать"
					class="btn btn-sm btn-light text-dark"
					onclick={() => {
						newRole = role;
						editedRoleUID = uid;
						isRoleEdited = true;
						isModalShow = true;
					}}>
					<i class="fa-solid fa-pencil"></i>
				</button>
				<button
					aria-label="удалить"
					class="btn btn-sm btn-light"
					title="Удалить роль {role.name}"
					onclick={async () =>
						remove(ref(db, `/roles/${uid}`)).then(
							v => ($alerts = [...$alerts, `Роль '${role.name}' удалена!`])
						)}>
					<i class="fa-solid fa-trash text-danger"></i>
				</button>
			</div>
		</div>
	{/each}
</div>

<Modal bind:isModalShow onClose={() => (newRole = Role())}>
	<h5 class="text-dark">{modalTitle}</h5>
	<div class="d-flex flex-column gap-1">
		<input class="form-control text-dark" bind:value={newRole.name} placeholder="название" />
		<div class="d-flex align-items-center justify-content-end gap-1">
			<button
				class="btn btn-light text-dark"
				onclick={() => {
					newRole = Role();
					isModalShow = false;
				}}>Отмена</button>
			<button
				class="btn btn-dark text-light"
				onclick={() => {
					if (newRole.name.trim() != '') {
						if (isRoleEdited) {
							// Перезаписываем тег
							update(ref(db, `roles/${editedRoleUID}`), newRole);
						} else {
							// Создаём новый тег
							if (!$state.snapshot(roles).find(r => r[1].name == newRole.name)) {
								push(ref(db, '/roles'), newRole);
							}
						}
					}
					editedRoleUID = '';
					newRole = Role();
					isRoleEdited = false;
					isModalShow = false;
				}}>Сохранить</button>
		</div>
	</div>
</Modal>

<style>
	.hover:hover {
		background-color: var(--bs-light);
		cursor: normal;
	}
</style>
