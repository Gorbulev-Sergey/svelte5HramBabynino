<script lang="ts">
	import { Tag } from '$lib/models/Tag';
	export let item = Tag();
	export let onDelete = () => {};
</script>

<div class="badge mb-1 d-inline-flex p-0 me-1">
	<div class="bg-dark text-light px-2 py-1 rounded-start">{item.name}</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="btn btn-sm btn-dark text-light px-1 py-0 rounded-0 rounded-end"
		on:click={() => onDelete()}>
		<i class="fa-solid fa-delete-left" />
	</div>
</div>
