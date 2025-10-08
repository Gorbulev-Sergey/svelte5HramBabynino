<script lang="ts">
	import { slide, scale } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { theme } from '$lib/scripts/store';
	import Large from './Breakpoint/Large.svelte';
	import Small from './Breakpoint/Small.svelte';

	let { children } = $props();
</script>

{#if browser}
	<Large>
		<div transition:scale class="m-0 px-5 py-4">
			{@render children?.()}
		</div>
	</Large>
	<Small>
		<div transition:scale class="p-3" style="margin:0 -1em">
			{@render children?.()}
		</div>
	</Small>
{/if}
