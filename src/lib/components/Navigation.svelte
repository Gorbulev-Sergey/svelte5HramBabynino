<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { isSystemTheme, theme } from '$lib/scripts/writableData';
	import Large from '$lib/components/Breakpoint/Large.svelte';
	import Smalle from '$lib/components/Breakpoint/Small.svelte';
	import IsAuth from '$lib/components/IsAuth.svelte';
	import { onMount } from 'svelte';

	export let title = 'Название';
	export let routesLeft = new Array();
	export let routesRight = new Array();
	let color = 'rgba(255,50,60,0)';

	$: changeTheme = (th, isSystemTheme1) => {
		if (!isSystemTheme1) {
			localStorage.setItem('isSystemTheme', 'false');
			$isSystemTheme = false;
			$theme = th == 'light' ? 'light' : 'dark';
			localStorage.setItem('theme', $theme);
		} else {
			localStorage.setItem('isSystemTheme', 'true');
			$isSystemTheme = true;
			// Определяем и переключаем светлую/тёмную тему
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				$theme = 'dark';
			} else {
				$theme = 'light';
			}
			localStorage.setItem('theme', $theme);
		}
	};

	onMount(async () => {
		// Устанавливаем прослушиватель на изменение темы в системе
		if (localStorage.getItem('isSystemTheme') == 'true') {
			$isSystemTheme = true;
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
				if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
					$theme = 'dark';
				} else {
					$theme = 'light';
				}
				localStorage.setItem('theme', $theme);
			});
		}
	});
</script>

<div id="top" />
<nav class="sticky-top bg-light text-dark no-print" style="backdrop-filter:blur(30em); padding:.75em 0">
	<Smalle>
		<div class="container-fluid d-flex justify-content-between align-items-center dropdown">
			<div class="flex-grow-1 d-flex justify-content-between align-items-center">
				<button class="btn btn-light text-dark border-0 text-uppercase me-1" style="background-color: {color}; font-size:.8em" on:click={() => goto(routesLeft[0].url)}>
					<b>{@html title}</b>
				</button>
				<div class="dropdown rounded">
					<button class="btn btn-light bg-light text-dark bg-transparent border-0" data-bs-toggle="dropdown" title="тема оформления"><i class="fa-regular fa-sun" /></button>
					<ul class="dropdown-menu dropdown-menu-end border-0 rounded w-100 bg-light text-dark shadow-sm py-1">
						<button class="btn btn-light {!$isSystemTheme && $theme == 'light' ? 'text-danger' : ' text-dark'} w-100 text-start rounded-0 ps-3" on:click={async () => changeTheme('light', false)}
							>Светлая тема</button>
						<button class="btn btn-light {!$isSystemTheme && $theme == 'dark' ? 'text-danger' : ' text-dark'} w-100 text-start rounded-0 ps-3" on:click={async () => changeTheme('dark', false)}
							>Тёмная тема</button>
						<button class="btn btn-light {$isSystemTheme ? 'text-danger' : ' text-dark'} w-100 text-start rounded-0 ps-3" on:click={async () => changeTheme('', true)}>Как в системе</button>
					</ul>
				</div>
			</div>
			<button class="btn btn-light text-dark bg-transparent border-0 text-uppercase" data-bs-toggle="dropdown"><i class="fa-solid fa-bars" /></button>

			<div class="dropdown-menu border-0 rounded-0 w-100 bg-light text-dark shadow-sm">
				{#each routesLeft as item}
					<div class="bg-light text-dark">
						<a class="btn btn-light text-dark w-100 text-start rounded-0 ps-3 {decodeURI($page.url.pathname).indexOf(item.url) >= 0 ? 'fw-bold' : ''}" href={item.url}>{item.title}</a>
					</div>
				{/each}
				<IsAuth>
					{#each routesRight as item}
						<div class="bg-light text-dark">
							<button
								class="btn btn-light bg-transparent text-dark w-100 text-start rounded-0 ps-3"
								on:click={async () => {
									goto(item.url);
								}}>
								<b class="text-uppercase">
									{item.title}
								</b>
							</button>
						</div>
					{/each}
				</IsAuth>
			</div>
		</div>
	</Smalle>
	<Large>
		<div class="container-fluid d-flex justify-content-between align-items-center">
			<div class="flex-grow-1 d-flex flex-wrap justify-content-between align-items-center">
				<button class="btn btn-light text-dark border-0 text-uppercase text-start me-3 rounded-1" style="background-color: {color}" on:click={() => goto(routesLeft[0].url)}
					><b class="text-nowrap">{@html title}</b></button>
				<div>
					{#each routesLeft as item}
						<a class="btn btn-light bg-light text-dark bg-transparent border-0 me-1 {decodeURI($page.url.pathname).indexOf(item.url) >= 0 ? 'fw-bold' : ''}" href={item.url}>{item.title} </a>
					{/each}
				</div>
			</div>
			<IsAuth>
				<div>
					{#each routesRight as item}
						<a class="btn btn-dark text-light border-0 me-1" href={item.url}>{item.title}</a>
					{/each}
				</div>
			</IsAuth>
			<div class="dropdown-center rounded">
				<button class="btn btn-light bg-light text-dark bg-transparent border-0" data-bs-toggle="dropdown" title="тема оформления"><i class="fa-regular fa-sun" /></button>
				<ul class="dropdown-menu border-0 rounded w-100 bg-light text-dark shadow-sm py-1">
					<button class="btn btn-light {!$isSystemTheme && $theme == 'light' ? 'text-danger' : ' text-dark'} w-100 text-start rounded-0 ps-3" on:click={async () => changeTheme('light', false)}
						>Светлая тема</button>
					<button class="btn btn-light {!$isSystemTheme && $theme == 'dark' ? 'text-danger' : ' text-dark'} w-100 text-start rounded-0 ps-3" on:click={async () => changeTheme('dark', false)}
						>Тёмная тема</button>
					<button class="btn btn-light {$isSystemTheme ? 'text-danger' : ' text-dark'} w-100 text-start rounded-0 ps-3" on:click={async () => changeTheme('', true)}>Как в системе</button>
				</ul>
			</div>
		</div>
	</Large>
</nav>
