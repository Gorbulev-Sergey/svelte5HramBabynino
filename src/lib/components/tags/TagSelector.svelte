<script lang="ts">
	import { Tag, type ITag } from '$lib/models/Tag';

	interface IProps {
		title: string;
		tags: ITag[];
		selected: ITag;
		_class?: string;
		onSelect: () => void;
	}

	let {
		title = 'Добавить тег:',
		tags = [],
		selected = $bindable(Tag()),
		_class = '',
		onSelect = () => {}
	}: IProps = $props();
</script>

<div class="btn-group btn-group-sm small {_class}">
	<div class="bg-dark text-light px-2 py-1 rounded-start" style="cursor:default;">{title}</div>
	<button
		aria-label=""
		class="btn btn-sm btn-secondary text-light rounded-end"
		data-bs-toggle="dropdown">
		<i class="fa-solid fa-circle-plus"></i>
	</button>
	<ul class="dropdown-menu overflow-y-scroll" style="max-height: 75vh;">
		{#each tags.sort((a, b) => a.name.localeCompare(b.name)) as item}
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
