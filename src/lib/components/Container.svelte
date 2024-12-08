<script lang="ts">
	import { browser } from '$app/environment';
	import { theme } from '$lib/scripts/store';
	import Large from './Breakpoint/Large.svelte';
	import Small from './Breakpoint/Small.svelte';

	let { children } = $props();
</script>

{#if browser}
	<Large>
		<div class="bg-white rounded-3 m-0 p-4 {$theme == 'light' ? 'shadow-sm' : ''}">
			{@render children?.()}
		</div>
	</Large>
	<Small>
		<div class="bg-white p-3" style="margin:0 -1em">
			{@render children?.()}
		</div>
	</Small>
{/if}
