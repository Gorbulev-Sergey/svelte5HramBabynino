<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Modal from '$lib/components/Modal.svelte';
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import { Tag } from '$lib/models/Tag';
	import { db } from '$lib/scripts/firebase';
	import { Header } from '$lib/scripts/store.js';
	import { ref, set } from 'firebase/database';
	import { onDestroy } from 'svelte';

	let { data } = $props();
	let tags = $state(data.tags);
	let tag = $state(new Tag());
	let modalTitle = $state('Создать тег');
	let isModalShow = $state(false);
	let saveToDb = async () => {
		set(ref(db, `/tags`), tags).then(() => {
			invalidateAll();
		});
	};
	$Header = header;
	onDestroy(() => ($Header = null));
</script>

{#snippet header()}
	<PageTitle title="Теги">
		<button
			class="btn btn-dark text-light"
			onclick={() => {
				modalTitle = 'Создать тег';
				isModalShow = true;
			}}>Создать</button>
	</PageTitle>
{/snippet}

<div class="d-flex flex-wrap gap-2 text-dark rounded p-3">
	{#each tags as item, i}
		<div class="btn-group btn-group-sm">
			<div
				class="flex-grow-1 d-flex align-items-center gap-1 text-dark border ps-1 pe-2 rounded-start align-items-center"
				style="cursor:default;">
				<small class="badge bg-dark text-light" style="font-size: .7em;">{i + 1}</small>
				{item.name}
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="btn btn-dark text-light"
				onclick={async () => {
					tags.splice(i - 1, 0, tags.splice(i, 1)[0]);
					saveToDb();
				}}>
				<i class="fa-solid fa-angle-left"></i>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="btn btn-dark text-light"
				onclick={async () => {
					tags.splice(i + 1, 0, tags.splice(i, 1)[0]);
					saveToDb();
				}}>
				<i class="fa-solid fa-angle-right"></i>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="btn btn-dark text-light"
				onclick={() => {
					tag = item;
					modalTitle = 'Редактировать тег';
					isModalShow = true;
				}}>
				<i class="fa-solid fa-pencil"></i>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="btn btn-dark text-dark"
				onclick={async () => {
					tags = tags.filter((t: Tag) => t != item);
					saveToDb();
				}}>
				<i class="fa-solid fa-trash text-danger"></i>
			</div>
		</div>
	{/each}
</div>

<Modal bind:isModalShow onClose={() => (tag = new Tag())}>
	<h5 class="text-dark">{modalTitle}</h5>
	<div class="d-flex flex-column gap-1">
		<input class="form-control text-dark" bind:value={tag.name} placeholder="название" />
		<input class="form-control text-dark" bind:value={tag.description} placeholder="описание" />
	</div>
	<div class="d-flex align-items-center justify-content-between">
		<button
			class="btn btn-light text-dark"
			onclick={() => {
				tag = new Tag();
				isModalShow = false;
			}}>Отмена</button>
		<button
			class="btn btn-dark text-light"
			onclick={() => {
				if (tag.name.trim() != '') {
					tag.name = tag.name.toLocaleLowerCase();
					if (!tag.description)
						tag.description = tag?.name[0].toLocaleUpperCase() + tag?.name.slice(1);
					else
						tag.description = tag?.description[0].toLocaleUpperCase() + tag?.description.slice(1);
					if (!tags.find((t: Tag) => t.name == tag.name && t.description == tag.description)) {
						set(ref(db, `/tags/${tags.length}`), tag).then(() => {
							invalidateAll();
						});
					} else saveToDb();
				}
				tag = new Tag();
				isModalShow = false;
			}}>Сохранить</button>
	</div>
</Modal>
