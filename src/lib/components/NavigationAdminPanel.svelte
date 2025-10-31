<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import IsAuth from '$lib/components/IsAuth.svelte';
	import { SETTINGS } from '$lib/settings/settings.svelte';

	interface IRoute {
		url: string;
		title: string;
	}

	interface IProps {
		routesLeft: IRoute[];
		routesRight: IRoute[];
	}

	let { routesLeft = [], routesRight = [] }: IProps = $props();

	let changeTheme = () => {
		SETTINGS.theme.theme = SETTINGS.theme.theme == 'light' ? 'dark' : 'light';
		localStorage.setItem('theme', SETTINGS.theme.theme);
	};
</script>

<nav class="d-flex flex-column">
	<div>
		{#each routesLeft as item}
			<div class="bg-light text-dark">
				<a
					class="btn btn-light text-dark w-100 text-start rounded-0 ps-3 {decodeURI(
						page.url.pathname
					).indexOf(item.url) >= 0
						? 'fw-bold'
						: ''}"
					href={item.url}>{item.title}</a>
			</div>
		{/each}
	</div>
	<IsAuth>
		<div class="mt-3">
			{#each routesRight as item}
				<div class="bg-light text-dark">
					<button
						class="btn btn-light text-dark w-100 text-start rounded-0 ps-3"
						onclick={async () => {
							goto(item.url);
						}}>
						<b class="text-uppercase">
							{item.title}
						</b>
					</button>
				</div>
			{/each}
		</div>
	</IsAuth>
	<div class="p-2 fixed-bottom">
		<button
			aria-label=""
			class="btn btn-light text-dark border-0"
			onclick={async () => changeTheme()}>
			<i class="fa-regular fa-sun"></i>
		</button>
	</div>
</nav>
