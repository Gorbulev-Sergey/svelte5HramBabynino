<script lang="ts">
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import type { IUser } from '$lib/models/admin/User';
	import { db } from '$lib/scripts/firebase';
	import { alerts, Header } from '$lib/scripts/store';
	import { onValue, ref, remove, set } from 'firebase/database';
	import { onDestroy, onMount } from 'svelte';

	let users = $state<[String, IUser][]>([]);
	let newUser = $state<IUser>({
		uid: '',
		email: '',
		role: {
			name: ''
		}
	});
	$Header = header;

	onMount(async () => {
		onValue(ref(db, '/users'), s => {
			if (s.exists()) {
				users = Object.entries(s.val()) as [string, IUser][];
			}
		});
	});
	onDestroy(() => ($Header = null));
</script>

{#snippet header()}
	<PageTitle title="Пользователи">
		<div class="input-group">
			<div class="p-2 bg-light rounded-start border">Новый пользователь:</div>
			<input class="form-control" bind:value={newUser.uid} placeholder="uid" />
			<input class="form-control" bind:value={newUser.email} placeholder="email" />
			<input class="form-control" bind:value={newUser.role.name} placeholder="название роли" />
			<button
				class="btn btn-dark text-light"
				onclick={async () => {
					set(ref(db, `users/${newUser.uid}`), newUser);
					newUser = {
						uid: '',
						email: '',
						role: {
							name: ''
						}
					};
				}}>Сохранить</button>
		</div>
	</PageTitle>
{/snippet}

<div class="p-1 d-flex flex-column gap-0">
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

<style>
	.hover:hover {
		background-color: var(--bs-light);
		cursor: normal;
	}
</style>
