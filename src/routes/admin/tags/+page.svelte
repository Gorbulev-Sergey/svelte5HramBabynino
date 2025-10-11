<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Modal from '$lib/components/Modal.svelte';
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import { Tag, type ITag } from '$lib/models/Tag';
	import { db } from '$lib/scripts/firebase';
	import { SETTINGS } from '$lib/store/store.svelte.js';
	import { onValue, ref, set, update } from 'firebase/database';
	import { onMount } from 'svelte';

	let tags: ITag[] = $state([]);
	let tag = $state(Tag());
	let indexEditedTag = $state(-1);
	let modalTitle = $state('Создать тег');
	let isModalShow = $state(false);
	function saveToDb(ts: ITag[]) {
		set(ref(db, `/tags`), ts).then(() => {
			invalidateAll();
		});
	}
	function saveOneToDb(t: ITag) {
		set(ref(db, `/tags/${tags.length}`), t).then(() => {
			invalidateAll();
		});
	}
	SETTINGS.Header = header;

	onMount(async () => {
		onValue(ref(db, '/tags'), s => {
			if (s.exists()) {
				tags = s.val();
			}
		});
	});
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

<div class="d-flex flex-column align-items-start flex-wrap gap-1 text-dark">
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
					saveToDb(tags);
				}}>
				<i class="fa-solid fa-angle-up"></i>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="btn btn-dark text-light"
				onclick={async () => {
					tags.splice(i + 1, 0, tags.splice(i, 1)[0]);
					saveToDb(tags);
				}}>
				<i class="fa-solid fa-angle-down"></i>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="btn btn-dark text-light"
				onclick={() => {
					modalTitle = 'Редактировать тег';
					tag = item;
					indexEditedTag = i;
					isModalShow = true;
				}}>
				<i class="fa-solid fa-pencil"></i>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="btn btn-dark text-dark"
				onclick={async () => {
					saveToDb(tags.filter((t: ITag) => t != item));
				}}>
				<i class="fa-solid fa-trash text-danger"></i>
			</div>
		</div>
	{/each}
</div>

<Modal bind:isModalShow onClose={() => (tag = Tag())}>
	<h5 class="text-dark">{modalTitle}</h5>
	<div class="d-flex flex-column gap-2">
		<input class="form-control text-dark" bind:value={tag.name} placeholder="название" />
		<input class="form-control text-dark" bind:value={tag.description} placeholder="описание" />
	</div>
	<div class="d-flex align-items-center justify-content-end gap-1">
		<button
			class="btn btn-light text-dark"
			onclick={() => {
				tag = Tag();
				isModalShow = false;
			}}>Отмена</button>
		<button
			class="btn btn-dark text-light"
			onclick={() => {
				if (tag.name.trim() != '') {
					{
						tag.name = tag.name.toLocaleLowerCase();
						if (!tag.description)
							tag.description = tag?.name[0].toLocaleUpperCase() + tag?.name.slice(1);
						else
							tag.description = tag?.description[0].toLocaleUpperCase() + tag?.description.slice(1);
					}
					if (modalTitle == 'Редактировать тег') {
						// Перезаписываем тег
						update(ref(db, `tags/${indexEditedTag}`), tag).then(() => {
							invalidateAll();
							tag = Tag();
							indexEditedTag = -1;
						});
					} else {
						// Создаём новый тег
						saveOneToDb(tag);
						tag = Tag();
					}
				}
				tag = Tag();
				isModalShow = false;
			}}>Сохранить</button>
	</div>
</Modal>
