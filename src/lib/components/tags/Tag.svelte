<script lang="ts">
	import { Tag, type ITag } from '$lib/models/Tag';

	interface IProps {
		item: ITag;
		onDelete: () => void;
	}

	let { item = Tag(), onDelete = () => {} }: IProps = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="badge mb-1 d-inline-flex p-0 me-1">
	<div class="bg-dark text-light px-2 py-1 rounded-start">{item.name}</div>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore event_directive_deprecated -->
	<div
		class="btn btn-sm btn-dark text-light px-1 py-0 rounded-0 rounded-end"
		on:click={() => onDelete()}>
		<i class="fa-solid fa-delete-left"></i>
	</div>
</div>
