<script lang="ts">
	import { type ITag } from '$lib/models/Tag';

	// export let title = 'тег:';
	// export let tags: ITag[] = [];
	// export let selected: ITag = {
	// 	name: 'главное',
	// 	description: 'Главное',
	// 	postUID: null
	// };
	// export let onSelect = (v: ITag) => v;
	// export let _class = '';

	interface IProps {
		title: string;
		tags: ITag[];
		selected: ITag;
		onSelect: (v: ITag) => ITag;
		_class?: string;
	}
	let { title = '', tags = [], selected = tags[0], onSelect, _class }: IProps = $props();
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
						onclick={() => {
							selected = item;
							onSelect(item);
						}}>{item.name}</button>
				</li>
			{/each}
		</ul>
	</div>
</div>
