<script lang="ts">
	import { scale } from 'svelte/transition';

	let { children } = $props();
</script>

<div transition:scale class="bg-white rounded mt-2 mb-5 mx-4 p-4">
	{@render children?.()}
</div>
