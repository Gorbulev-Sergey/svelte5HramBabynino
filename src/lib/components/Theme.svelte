<script lang="ts">
	import { theme } from '$lib/scripts/store';

	$effect.pre(() => {
		$theme = localStorage.getItem('theme') ?? 'light';
		$theme ? localStorage.getItem('theme') : localStorage.setItem('theme', 'light');

		document.querySelector('#theme')?.setAttribute('href', `/bootstrap.${$theme}.min.css`);
	});
</script>

<!-- <svelte:head>
	<link href="/bootstrap.{$theme == '' ? 'light' : $theme}.min.css" rel="stylesheet" />
</svelte:head> -->
