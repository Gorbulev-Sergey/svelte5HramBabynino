<script lang="ts">
	import { type Tag } from '$lib/models/Tag';
	interface Props {
		item: Tag;
		onDelete: () => void;
	}
	let { item, onDelete }: Props = $props();
</script>

<div class="badge mb-1 d-inline-flex p-0 me-1">
	<div class="bg-dark text-light px-2 py-1 rounded-start">{item.name}</div>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="btn btn-sm btn-dark text-light px-1 py-0 rounded-0 rounded-end"
		onclick={() => onDelete()}>
		<i class="fa-solid fa-delete-left"></i>
	</div>
</div>
