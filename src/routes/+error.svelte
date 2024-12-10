<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	onMount(() => {
		setTimeout(() => {
			goto('/');
		}, 3000);
	});
</script>

<div
	class="d-flex flex-column justify-content-center align-items-center text-dark gap-2 p-3 w-100 bg-light text-dark"
	style="height: 100svh; font-size:1.4em">
	<h1 class="text-danger text-opacity-75">Страница не найдена!</h1>
	<div class="text-opacity-75 text-center">
		Через несколко секунд вы будете направлены на главную страницу сайта.
	</div>
</div>
