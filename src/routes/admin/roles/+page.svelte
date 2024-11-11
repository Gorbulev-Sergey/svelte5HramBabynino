<script lang="ts">
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import type { IRole } from '$lib/models/admin/Role';
	import { db } from '$lib/scripts/firebase';
	import { alerts, Header } from '$lib/scripts/store';
	import { onValue, push, ref, remove, set, update } from 'firebase/database';
	import { onDestroy, onMount } from 'svelte';

	let roles = $state<[string, IRole][]>([]);
	let newRole = $state<IRole>({
		name: ''
	});
	let isRoleEdit = $state(false);
	let editedRoleUID = $state('');
	$Header = header;

	onMount(async () => {
		onValue(ref(db, '/roles'), s => {
			if (s.exists()) roles = Object.entries(s.val()) as [string, IRole][];
		});
	});
	onDestroy(() => ($Header = null));
</script>

{#snippet header()}
	<PageTitle title="Роли пользователей">
		<div class="input-group">
			<div class="bg-light text-dark py-2 px-3 rounded-start border">
				{!isRoleEdit ? 'Новая' : 'Редактировать'} роль:
			</div>

			<input class="form-control text-dark" bind:value={newRole.name} />
			{#if newRole.name.length > 0}
				<button
					aria-label=""
					class="btn btn-light text-dark border {newRole.name.length > 0 ? '' : ''}"
					onclick={() => {
						newRole.name = '';
					}}>
					<i class="fa-solid fa-xmark"></i>
				</button>
			{/if}

			{#if !isRoleEdit}
				<button
					class="btn btn-dark text-light"
					onclick={async () => {
						if (
							roles.filter(v => v[1].name == newRole.name).length == 0 &&
							newRole.name.trim().length > 0
						) {
							push(ref(db, '/roles'), newRole).then(r => {
								$alerts = [...$alerts, `Роль '${newRole.name}' добавлена!`];
								newRole = { name: '' };
							});
						}
					}}>Создать</button>
			{:else}
				<button
					class="btn btn-light text-dark border"
					onclick={async () => {
						newRole = { name: '' };
						isRoleEdit = false;
						editedRoleUID = '';
					}}>Отмена</button>
				<button
					class="btn btn-dark text-light"
					onclick={async () => {
						if (newRole.name.trim().length > 0) {
							update(ref(db, `/roles/${editedRoleUID}`), newRole).then(r => {
								$alerts = [...$alerts, `Роль '${newRole.name}' обновлена!`];
								newRole = { name: '' };
								isRoleEdit = false;
								editedRoleUID = '';
							});
						}
					}}>Сохранить</button>
			{/if}
		</div>
	</PageTitle>
{/snippet}

<div class="p-1 d-flex flex-column gap-0">
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
						isRoleEdit = true;
						editedRoleUID = uid;
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

<style>
	.hover:hover {
		background-color: var(--bs-light);
		cursor: normal;
	}
</style>
