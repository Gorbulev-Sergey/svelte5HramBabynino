<script lang="ts">
	import Tag from './Tag.svelte';
	import { type ITag as _ITag, Tag as getTag } from '$lib/models/Tag';
	import TagSelector from './TagSelector.svelte';
	import { onMount } from 'svelte';

	interface IProps {
		title: string;
		tags: _ITag[];
		selectedTags: _ITag[];
		onSelect: () => void;
		_class?: string;
	}
	let {
		title = 'Добавить тег:',
		tags = $bindable([]),
		selectedTags = $bindable([]),
		onSelect = () => {
			tags = tags.filter(t => !selectedTags.includes(t));
		},
		_class = ''
	}: IProps = $props();
	let selectedTag: _ITag = $state(getTag());

	onMount(async () => {
		//setTimeout(() => onSelect(), 10000);
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
					if (!selectedTags) selectedTags = new Array();
					selectedTags = [...selectedTags, selectedTag];
					tags = tags.filter(t => t.name != selectedTag.name);
					selectedTag = getTag();
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
