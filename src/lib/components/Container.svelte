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
		<div transition:scale class={SETTINGS.theme.theme == 'light' ? '' : ''}>
			{@render children?.()}
		</div>
	</Large>
	<Small>
		<div transition:scale class="" style="margin:0 -1em">
			{@render children?.()}
		</div>
	</Small>
{/if}
