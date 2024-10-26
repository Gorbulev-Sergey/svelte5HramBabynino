<script lang="ts">
	import { theme } from '$lib/scripts/writableData';
	import { onMount } from 'svelte';

	onMount(async () => {
		$theme = localStorage.getItem('theme') || 'light';
		$theme ? localStorage.getItem('theme') : localStorage.setItem('theme', 'light');

		// Ставим небольшую задержку на появление контента,
		// она нужна для того, чтобы в тёмной теме изначально не отображался контент без применённых
		// стилей bootstrap, т.к. в тёмной теме свойства ещё не прочитаны из localStorage, и файл bootstrap ущё не загружен
		setTimeout(() => {
			document.querySelector('body').style.opacity = '1';
		}, 500);
	});
</script>

<svelte:head>
	<link href="/bootstrap.{$theme == '' ? 'light' : $theme}.min.css" rel="stylesheet" />
</svelte:head>
