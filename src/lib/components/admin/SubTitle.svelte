<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, _class = 'pe-2' }: { children?: Snippet; _class?: String } = $props();
</script>

<div class="ps-4 pb-3 {_class}">
	{@render children?.()}
</div>
