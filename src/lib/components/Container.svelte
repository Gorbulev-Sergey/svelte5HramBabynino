<script lang="ts">
	import { scale } from 'svelte/transition';
	import { browser } from '$app/environment';
	import Large from './Breakpoint/Large.svelte';
	import Small from './Breakpoint/Small.svelte';
	import { SETTINGS } from '$lib/settings/settings.svelte';

	let { children } = $props();
</script>

{#if browser}
	<Large>
		<div
			transition:scale
			class="bg-white rounded-3 m-0 p-4 {SETTINGS.theme.theme == 'light' ? 'shadow-sm' : ''}">
			{@render children?.()}
		</div>
	</Large>
	<Small>
		<div transition:scale class="bg-white p-3" style="margin:0 -1em">
			{@render children?.()}
		</div>
	</Small>
{/if}
