<script lang="ts">
	import PageTitleWrap from '$lib/components/PageTitleWrap.svelte';
	import { Tag } from '$lib/models/Tag';
	import { db } from '$lib/scripts/firebase';
	import { ref, set } from 'firebase/database';

	let { data } = $props();
	let tags = $state(data.tags);
	let tag = $state(new Tag());
	let saveToDb = async () => {
		set(ref(db, `/tags`), tags);
	};
</script>

<PageTitleWrap title="Теги">
	<div slot="navigation" class="d-flex align-items-center">
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
	</div>
</PageTitleWrap>

<div class="text-dark rounded p-3">
	<h5 class="mb-3">Доступные теги</h5>
	{#each tags as item, i}
		<div class="btn-group btn-group-sm me-2 mb-2">
			<div
				class="d-flex text-dark border pb-1 px-2 rounded-start align-items-center"
				style="cursor:default;">
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
