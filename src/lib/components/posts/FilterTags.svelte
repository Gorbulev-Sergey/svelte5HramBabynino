<script lang="ts">
	import { Tag, type ITag } from '$lib/models/Tag';

	export let title = 'тег:';
	export let tags: ITag[] = [];
	export let selected = Tag('главное', 'Главное');
	export let onSelect = (v: ITag) => v;
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
		<ul class="dropdown-menu bg-light border-0 overflow-y-scroll" style="max-height: 75vh;">
			<div class="d-flex flex-column">
				{#each tags as item}
					<li>
						<button
							class="btn {item.name == selected.name
								? 'fw-bold '
								: ''} btn-sm btn-light text-dark rounded-0 w-100 text-start text-nowrap"
							on:click={() => {
								selected = item;
								onSelect(item);
							}}>{item.name}</button>
					</li>
				{/each}
			</div>
		</ul>
	</div>
</div>
