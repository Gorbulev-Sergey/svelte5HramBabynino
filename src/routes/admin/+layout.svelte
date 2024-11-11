<script lang="ts">
	import { Header, isSystemTheme, theme } from '$lib/scripts/store';
	import IsAuth from '$lib/components/IsAuth.svelte';
	import { User } from '$lib/models/admin/User';
	import { auth, db } from '$lib/scripts/firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import { onValue, ref } from 'firebase/database';
	import { onMount, type Snippet } from 'svelte';
	import { goto } from '$app/navigation';

	let routesLeft = [
		{
			url: '/admin/posts',
			title: 'Публикации'
		},
		{
			url: '/admin/schedule',
			title: 'Расписание'
		},
		{
			url: '/admin/photos',
			title: 'Фотографии'
		},
		{
			url: '/admin/storage',
			title: 'Хранилище'
		},
		{
			url: '/admin/tags',
			title: 'Теги'
		},
		{
			url: '/admin/contacts',
			title: 'Контакты'
		}
	];
	let routesOnlyForAdmins = [
		{
			url: '/admin/users',
			title: 'Пользователи'
		},
		{
			url: '/admin/roles',
			title: 'Роли'
		}
	];
	let routesRight = [
		{
			url: '/posts',
			title: 'Сайт'
		}
	];
	let { children }: { children: Snippet } = $props();
	let isCurrentUserAdmin = $state(false);

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
		onAuthStateChanged(auth, user => {
			if (user) {
				onValue(ref(db, '/users'), s => {
					if (
						s.exists() &&
						(Object.values(s.val()) as User[]).find(
							u => u.uid == user.uid && u.role.name == 'админ'
						)
					) {
						isCurrentUserAdmin = true;
					}
				});
			}
		});
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

<!-- <IsAuth>
	<Navigation
		title="Панель управления"
		routesLeft={isCurrentUserAdmin ? [...routesLeft, ...routesOnlyForAdmins] : routesLeft}
		{routesRight}>
		{@render $Header?.()}
	</Navigation>
	<div class="container mt-1 mb-4" style="min-height:90vh;">
		<Container>
			{@render children?.()}
		</Container>
	</div>
	<Footer />
	<Alerts />
</IsAuth> -->

<IsAuth>
	<div class="d-flex align-items-start">
		<div class="d-flex flex-column shadow sticky-top bg-light" style="min-height:100vh">
			<button
				class="btn btn-light bg-light border-0 text-dark p-3 mb-4 text-uppercase fw-bold text-nowrap"
				onclick={() => goto('/admin/posts')}>Панель управления</button>
			<div class="d-flex flex-column">
				{#each routesLeft as { url, title }}
					<button
						class="btn btn-light text-dark rounded-0 text-start px-3"
						onclick={() => goto(url)}>
						{title}
					</button>
				{/each}
				{#if isCurrentUserAdmin}
					{#each routesOnlyForAdmins as { url, title }}
						<button
							class="btn btn-light text-dark rounded-0 text-start px-3"
							onclick={() => goto(url)}>{title}</button>
					{/each}
				{/if}
				{#each routesRight as { url, title }}
					<button
						class="btn btn-light text-dark rounded-0 text-start px-3"
						onclick={() => goto(url)}>
						<b class=" text-uppercase">{title}</b>
					</button>
				{/each}
			</div>
			<div class="flex-grow-1 d-flex align-items-end pb-3">
				<div class="dropdown-center rounded">
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button
						class="btn btn-light bg-light text-dark bg-transparent border-0 px-3"
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
		<div class="flex-grow-1 d-flex flex-column">
			<div class="d-flex flex-column sticky-top">
				{#if $Header}
					<div class="bg-light">
						{@render $Header?.()}
					</div>
				{/if}
				<!-- <div class="bg-light px-3 pb-2">Разное</div> -->
			</div>
			<div class="container mt-3 mb-5 px-3">
				{@render children?.()}
			</div>
		</div>
	</div>
</IsAuth>
