<script lang="ts">
	import { SETTINGS } from '$lib/settings/settings.svelte';

	$effect.pre(() => {
		SETTINGS.theme.theme = localStorage.getItem('theme') ?? 'light';
		SETTINGS.theme.theme ? localStorage.getItem('theme') : localStorage.setItem('theme', 'light');

		document
			.querySelector('#theme')
			?.setAttribute('href', `/bootstrap.${SETTINGS.theme.theme}.min.css`);
	});
</script>

<!-- <svelte:head>
	<link href="/bootstrap.{$theme == '' ? 'light' : $theme}.min.css" rel="stylesheet" />
</svelte:head> -->
