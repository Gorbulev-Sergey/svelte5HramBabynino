<script lang="ts">
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import { Tag } from '$lib/models/Tag';
	import { db } from '$lib/scripts/firebase';
	import { Header } from '$lib/scripts/store.js';
	import { ref, set } from 'firebase/database';
	import { onDestroy } from 'svelte';

	let { data } = $props();
	let tags = $state(data.tags);
	let tag = $state(new Tag());
	let saveToDb = async () => {
		set(ref(db, `/tags`), tags);
	};
	$Header = header;
	onDestroy(() => ($Header = null));
</script>

{#snippet header()}
	<PageTitle title="Теги">
		<div class="input-group">
			<span class="input-group-text"><i class="fa-solid fa-circle-plus"></i></span>
			<input class="form-control" placeholder="название" bind:value={tag.name} />
			<input class="form-control" placeholder="описание" bind:value={tag.description} />
			<button class="btn btn-dark text-light" onclick={() => (tag = new Tag())}>Отмена</button>
			<button
				class="btn btn-dark text-light"
				onclick={() => {
					if (tag.name.trim() != '') {
						tag.name = tag.name.toLocaleLowerCase();
						if (!tag.description)
							tag.description = tag?.name[0].toLocaleUpperCase() + tag?.name.slice(1);
						else
							tag.description = tag?.description[0].toLocaleUpperCase() + tag?.description.slice(1);
						if (!tags.find(t => t.name == tag.name && t.description == tag.description)) {
							tags = [...tags, tag];
						}
						saveToDb();
						tag = new Tag();
					}
				}}>Сохранить</button>
		</div>
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
				}}>
				<i class="fa-solid fa-pencil"></i>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="btn btn-dark text-dark"
				onclick={async () => {
					tags = tags.filter(t => t != item);
					saveToDb();
				}}>
				<i class="fa-solid fa-trash text-danger"></i>
			</div>
		</div>
	{/each}
</div>
