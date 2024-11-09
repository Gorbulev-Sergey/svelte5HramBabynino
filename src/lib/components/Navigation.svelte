<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { isSystemTheme, subPanel, theme } from '$lib/scripts/writableData';
	import Large from '$lib/components/Breakpoint/Large.svelte';
	import Smalle from '$lib/components/Breakpoint/Small.svelte';
	import IsAuth from '$lib/components/IsAuth.svelte';
	import { onMount, type Snippet } from 'svelte';

	interface Props {
		title: String;
		routesLeft: { url: string; title: string }[];
		routesRight: { url: string; title: string }[];
		children?: Snippet<[]>;
	}

	let { title = 'Название', routesLeft = [], routesRight = [], children }: Props = $props();
	let color = $state('rgba(255,50,60,0)');

	let changeTheme = (th: string, isSystemTheme1: boolean) => {
		if (!isSystemTheme1) {
			$theme = th;
			$isSystemTheme = false;
			localStorage.setItem('theme', $theme);
			localStorage.setItem('isSystemTheme', 'false');
		} else {
			// Определяем и переключаем светлую/тёмную тему
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				$theme = 'dark';
			} else {
				$theme = 'light';
			}
			$isSystemTheme = true;
			localStorage.setItem('theme', $theme);
			localStorage.setItem('isSystemTheme', 'true');
		}
	};

	onMount(async () => {
		if (localStorage.getItem('isSystemTheme') == 'true') {
			$isSystemTheme = true;
			// Устанавливаем прослушиватель на изменение темы в системе
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
				if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
					$theme = 'dark';
				} else {
					$theme = 'light';
				}
				localStorage.setItem('theme', $theme);
			});
		} else {
			$isSystemTheme = false;
		}
	});
</script>

<div id="top" />
<nav
	class="sticky-top bg-light text-dark no-print"
	style="backdrop-filter:blur(30em); padding:.75em 0">
	<Smalle>
		<div class="container-fluid d-flex justify-content-between align-items-center dropdown">
			<div class="flex-grow-1 d-flex justify-content-between align-items-center">
				<button
					class="btn btn-light text-dark border-0 text-uppercase me-1"
					style="background-color: {color}; font-size:.8em"
					onclick={() => goto(routesLeft[0].url)}>
					<b>{@html title}</b>
				</button>
				<div class="dropdown rounded">
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button
						class="btn btn-light bg-light text-dark bg-transparent border-0"
						data-bs-toggle="dropdown"
						title="тема оформления"><i class="fa-regular fa-sun" /></button>
					<ul
						class="dropdown-menu dropdown-menu-end border-0 rounded w-100 bg-light text-dark shadow-sm py-1">
						<button
							class="btn btn-light {!$isSystemTheme && $theme == 'light'
								? 'text-danger'
								: ' text-dark'} w-100 text-start rounded-0 ps-3"
							onclick={async () => changeTheme('light', false)}>Светлая тема</button>
						<button
							class="btn btn-light {!$isSystemTheme && $theme == 'dark'
								? 'text-danger'
								: ' text-dark'} w-100 text-start rounded-0 ps-3"
							onclick={async () => changeTheme('dark', false)}>Тёмная тема</button>
						<button
							class="btn btn-light {$isSystemTheme
								? 'text-danger'
								: ' text-dark'} w-100 text-start rounded-0 ps-3"
							onclick={async () => changeTheme('', true)}>Как в системе</button>
					</ul>
				</div>
			</div>
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button
				class="btn btn-light text-dark bg-transparent border-0 text-uppercase"
				data-bs-toggle="dropdown"><i class="fa-solid fa-bars" /></button>

			<div class="dropdown-menu border-0 rounded-0 w-100 bg-light text-dark shadow-sm">
				{#each routesLeft as item}
					<div class="bg-light text-dark">
						<a
							class="btn btn-light text-dark w-100 text-start rounded-0 ps-3 {decodeURI(
								$page.url.pathname
							).indexOf(item.url) >= 0
								? 'fw-bold'
								: ''}"
							href={item.url}>{item.title}</a>
					</div>
				{/each}
				<IsAuth>
					{#each routesRight as item}
						<div class="bg-light text-dark">
							<button
								class="btn btn-light bg-transparent text-dark w-100 text-start rounded-0 ps-3"
								onclick={async () => {
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
		<div class="d-flex flex-column">
			<div class="container-fluid d-flex justify-content-between align-items-center">
				<div class="flex-grow-1 d-flex flex-wrap justify-content-between align-items-center">
					<button
						class="btn btn-light text-dark border-0 text-uppercase text-start me-3 rounded-1"
						style="background-color: {color}"
						onclick={() => goto(routesLeft[0].url)}
						><b class="text-nowrap">{@html title}</b></button>
					<div>
						{#each routesLeft as item}
							<a
								class="btn btn-light bg-light text-dark bg-transparent border-0 me-1 {decodeURI(
									$page.url.pathname
								).indexOf(item.url) >= 0
									? 'fw-bold'
									: ''}"
								href={item.url}
								>{item.title}
							</a>
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
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button
						class="btn btn-light bg-light text-dark bg-transparent border-0"
						data-bs-toggle="dropdown"
						title="тема оформления"><i class="fa-regular fa-sun"></i></button>
					<ul class="dropdown-menu border-0 rounded w-100 bg-light text-dark shadow-sm py-1">
						<button
							class="btn btn-light {!$isSystemTheme && $theme == 'light'
								? 'text-danger'
								: ' text-dark'} w-100 text-start rounded-0 ps-3"
							onclick={async () => changeTheme('light', false)}>Светлая тема</button>
						<button
							class="btn btn-light {!$isSystemTheme && $theme == 'dark'
								? 'text-danger'
								: ' text-dark'} w-100 text-start rounded-0 ps-3"
							onclick={async () => changeTheme('dark', false)}>Тёмная тема</button>
						<button
							class="btn btn-light {$isSystemTheme
								? 'text-danger'
								: ' text-dark'} w-100 text-start rounded-0 ps-3"
							onclick={async () => changeTheme('', true)}>Как в системе</button>
					</ul>
				</div>
			</div>
		</div>
	</Large>
	{#if $subPanel != null}
		<div class="px-3">
			<hr />
			{@render children?.()}
		</div>
	{/if}
</nav>
