<script lang="ts">
	import { type Tag } from '$lib/models/Tag';

	export let title = 'тег:';
	export let tags: Tag[] = [];
	export let selected: Tag = {
		name: 'главное',
		description: 'Главное'
	};
	export let onSelect = (v: Tag) => v;
	export let _class = '';
</script>

<div class="btn-group {_class}">
	<div class="btn btn-sm bg-dark text-light">{title}</div>
	<div class="dropdown">
		<button
			class="btn btn-sm btn-light text-dark dropdown-toggle rounded-0 rounded-end"
			data-bs-toggle="dropdown">
			{selected.name}
		</button>
		<ul class="dropdown-menu bg-light border-0">
			{#each tags as item}
				<li>
					<button
						class="btn btn-light text-dark rounded-0 w-100 text-start text-nowrap"
						on:click={() => {
							selected = item;
							onSelect(item);
						}}>{item.name}</button>
				</li>
			{/each}
		</ul>
	</div>
</div>
