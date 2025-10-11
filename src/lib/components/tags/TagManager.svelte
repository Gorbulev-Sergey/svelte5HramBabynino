<script lang="ts">
	import Tag from './Tag.svelte';
	import { Tag as _Tag, type ITag } from '$lib/models/Tag';
	import TagSelector from './TagSelector.svelte';
	import { onMount } from 'svelte';

	interface IProps {
		title?: string;
		tags: ITag[];
		selectedTag: ITag;
		selectedTags: ITag[];
		_class?: string;
		onSelect: () => void;
	}

	let {
		title = 'Добавить тег:',
		tags = [],
		selectedTag = _Tag(),
		selectedTags = $bindable([]),
		_class = '',
		onSelect = () => {
			tags = tags.filter(t => !selectedTags.includes(t));
		}
	}: IProps = $props();

	onMount(async () => {
		setTimeout(() => onSelect(), 10000);
	});
</script>

<div class="d-flex justify-content-end text-end align-items-center flex-wrap gap-1 {_class}">
	<div class={tags.length == 0 ? 'hide' : ''}>
		<TagSelector
			{title}
			{tags}
			bind:selected={selectedTag}
			onSelect={() => {
				if (selectedTag.name != '') {
					if (!selectedTags) selectedTags = [];
					selectedTags = [...selectedTags, selectedTag];
					tags = tags.filter(t => t.name != selectedTag.name);
					selectedTag = _Tag();
					onSelect();
				}
			}} />
		{#if selectedTags}
			{#each selectedTags as item}
				<Tag
					{item}
					onDelete={() => {
						tags = [...tags, item];
						selectedTags = selectedTags.filter(t => t.name != item.name);
						onSelect();
					}} />
			{/each}
		{/if}
	</div>
</div>
