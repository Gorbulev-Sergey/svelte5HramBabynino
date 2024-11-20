<script lang="ts">
	import { type Tag } from '$lib/models/Tag';

	interface Props {
		title: string;
		tags: Tag[];
		selected: Tag;
		_class: string;
		onSelect: () => void;
	}
	let {
		title = 'Добавить тег:',
		tags = $bindable([]),
		selected = $bindable({} as Tag),
		_class = '',
		onSelect
	}: Props = $props();
</script>

<div class="btn-group btn-group-sm small {_class}">
	<div class="bg-dark text-light px-2 py-1 rounded-start" style="cursor:default;">{title}</div>
	<button
		aria-label=""
		class="btn btn-sm btn-secondary text-light rounded-end"
		data-bs-toggle="dropdown">
		<i class="fa-solid fa-circle-plus"></i>
	</button>
	<ul class="dropdown-menu">
		{#each tags as item}
			<li>
				<button
					class="dropdown-item"
					onclick={() => {
						selected = item;
						onSelect();
					}}>{item.name}</button>
			</li>
		{/each}
	</ul>
</div>
