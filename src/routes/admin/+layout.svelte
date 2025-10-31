<script lang="ts">
	import Container from '$lib/components/admin/Container.svelte';
	import IsAuth from '$lib/components/IsAuth.svelte';
	import { type IUser } from '$lib/models/admin/User';
	import { auth, db } from '$lib/settings/firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import { onValue, ref } from 'firebase/database';
	import { onMount, type Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { SETTINGS } from '$lib/settings/settings.svelte';

	interface IProps {
		children: Snippet;
	}

	interface IRoute {
		url: string;
		title: string;
		icon?: string;
	}

	let routesLeft: IRoute[] = [
		{
			url: '/admin/posts',
			title: 'Публикации',
			icon: 'fa-regular fa-newspaper'
		},
		{
			url: '/admin/schedule',
			title: 'Расписание',
			icon: 'fa-regular fa-calendar-days'
		},
		{
			url: '/admin/photos',
			title: 'Фотографии',
			icon: 'fa-regular fa-images'
		},
		{
			url: '/admin/tags',
			title: 'Теги',
			icon: 'fa-solid fa-tags'
		},
		{
			url: '/admin/contacts',
			title: 'Контакты',
			icon: 'fa-regular fa-id-card'
		},
		{
			url: '/admin/vkalbums',
			title: 'ВК альбомы',
			icon: 'fa-solid fa-images'
		},
		{
			url: '/admin/storage',
			title: 'Хранилище firestore',
			icon: 'fa-solid fa-gift'
		},

		{
			url: '/admin/vkvideo',
			title: 'ВК видео',
			icon: 'fa-brands fa-vk'
		}
	];
	let routesOnlyForAdmins: IRoute[] = [
		{
			url: '/admin/users',
			title: 'Пользователи',
			icon: 'fa-solid fa-users'
		},
		{
			url: '/admin/roles',
			title: 'Роли',
			icon: 'fa-solid fa-list-ol'
		}
	];
	let routesRight: IRoute[] = [
		{
			url: '/posts',
			title: 'На сайт',
			icon: 'fa-solid fa-right-from-bracket'
		}
	];
	let isCurrentUserAdmin = $state(false);
	let activeRoute: IRoute = $state(routesLeft[0]);

	let { children }: IProps = $props();

	let changeTheme = (th: string, isSystem: boolean) => {
		if (!isSystem) {
			SETTINGS.theme.theme = th;
			SETTINGS.theme.isSystem = false;
			localStorage.setItem('theme', SETTINGS.theme.theme);
			localStorage.setItem('SETTINGS.theme.isSystem', 'false');
		} else {
			// Определяем и переключаем светлую/тёмную тему
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				SETTINGS.theme.theme = 'dark';
			} else {
				SETTINGS.theme.theme = 'light';
			}
			SETTINGS.theme.isSystem = true;
			localStorage.setItem('theme', SETTINGS.theme.theme);
			localStorage.setItem('SETTINGS.theme.isSystem', 'true');
		}
	};

	onMount(async () => {
		SETTINGS.ADMIN.Header = header;
		onAuthStateChanged(auth, user => {
			if (user) {
				onValue(ref(db, '/users'), s => {
					if (
						s.exists() &&
						(Object.values(s.val()) as IUser[]).find(
							u => u.uid == user.uid && u.role.name == 'админ'
						)
					) {
						isCurrentUserAdmin = true;
					}
				});
			}
		});

		// Работаем с темой
		if (localStorage.getItem('SETTINGS.theme.isSystem') == 'true') {
			SETTINGS.theme.isSystem = true;
			// Устанавливаем прослушиватель на изменение темы в системе
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
				if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
					SETTINGS.theme.theme = 'dark';
				} else {
					SETTINGS.theme.theme = 'light';
				}
				localStorage.setItem('theme', SETTINGS.theme.theme);
			});
		} else {
			SETTINGS.theme.isSystem = false;
		}

		// Работаем с компактным/полным размером админ-панели
		if (!localStorage.getItem('SETTINGS.ADMIN.isCompactMode'))
			localStorage.setItem('SETTINGS.ADMIN.isCompactMode', String(SETTINGS.ADMIN.isCompactMode));
		else
			SETTINGS.ADMIN.isCompactMode =
				localStorage.getItem('SETTINGS.ADMIN.isCompactMode') === 'true';

		// Работаем с количеством колонок постов
		if (!localStorage.getItem('SETTINGS.ADMIN.posts.columns.now'))
			localStorage.setItem(
				'SETTINGS.ADMIN.posts.columns.now',
				String(SETTINGS.ADMIN.posts.columns.now)
			);
		else
			SETTINGS.ADMIN.posts.columns.now = Number(
				localStorage.getItem('SETTINGS.ADMIN.posts.columns.now')
			);
		// Работаем с количеством колонок альбомов
		if (!localStorage.getItem('SETTINGS.ADMIN.albums.columns.now'))
			localStorage.setItem(
				'SETTINGS.ADMIN.albums.columns.now',
				String(SETTINGS.ADMIN.albums.columns.now)
			);
		else
			SETTINGS.ADMIN.albums.columns.now = Number(
				localStorage.getItem('SETTINGS.ADMIN.albums.columns.now')
			);
		// Работаем с количеством колонок фотографий на странице хранилища
		if (!localStorage.getItem('SETTINGS.ADMIN.albums.columns.now'))
			localStorage.setItem(
				'SETTINGS.ADMIN.albums.columns.now',
				String(SETTINGS.ADMIN.albums.columns.now)
			);
		else
			SETTINGS.ADMIN.albums.step = Number(
				localStorage.getItem('SETTINGS.ADMIN.albums.columns.now')
			);
	});

	let isButtonOnTopShow = $state(false);
	window.addEventListener('scroll', () => {
		if (window.scrollY > 10) {
			isButtonOnTopShow = true;
		} else {
			isButtonOnTopShow = false;
		}
	});
</script>

{#snippet header()}{/snippet}

<IsAuth>
	<div class="d-flex align-items-start">
		<div
			class="d-flex flex-column shadow sticky-top bg-light no-print gap-1"
			style="height:100vh; z-index: 10000">
			{#if !SETTINGS.ADMIN.isCompactMode}
				<button
					class="btn btn-light bg-light border-0 text-dark px-3 pt-4 pb-3 mb-2 text-uppercase fw-bold text-nowrap"
					onclick={() => goto('/admin/posts')}>
					Панель управления
				</button>
			{/if}
			<div class="d-flex flex-column gap-1 m-1">
				{#each routesLeft as { url, title, icon }}
					<button
						{title}
						class="btn text-start px-3 {activeRoute.url == url
							? 'btn-dark text-light'
							: 'btn-light text-dark'}"
						onclick={() => {
							activeRoute = { url: url, title: title, icon: icon };
							goto(url);
						}}>
						<div class="d-flex align-items-center gap-2">
							<i class="{icon} icon-width {SETTINGS.ADMIN.isCompactMode ? 'py-1' : ''}"></i>
							{#if !SETTINGS.ADMIN.isCompactMode}
								{title}
							{/if}
						</div>
					</button>
				{/each}
				{#if isCurrentUserAdmin}
					{#each routesOnlyForAdmins as { url, title, icon }}
						<button
							{title}
							class="btn text-start px-3 {activeRoute.url == url
								? 'btn-dark text-light'
								: 'btn-light text-dark'}"
							onclick={() => {
								activeRoute = { url: url, title: title, icon: icon };
								goto(url);
							}}>
							<div class="d-flex align-items-center gap-2">
								<i class="{icon} icon-width {SETTINGS.ADMIN.isCompactMode ? 'py-1' : ''}"></i>
								{#if !SETTINGS.ADMIN.isCompactMode}
									{title}
								{/if}
							</div>
						</button>
					{/each}
				{/if}
				{#each routesRight as { url, title, icon }}
					<button {title} class="btn btn-light text-dark text-start px-3" onclick={() => goto(url)}>
						<b class="text-uppercase">
							<div class="d-flex align-items-center gap-2">
								<i
									class="{icon} icon-width {SETTINGS.ADMIN.isCompactMode ? 'py-1' : ''} "
									style="transform: rotate(-180deg);"></i>
								{#if !SETTINGS.ADMIN.isCompactMode}
									{title}
								{/if}
							</div>
						</b>
					</button>
				{/each}
			</div>
			<div
				class="flex-grow-1 d-flex mx-1 {SETTINGS.ADMIN.isCompactMode
					? 'flex-column-reverse'
					: 'align-items-end justify-content-between'} pb-3">
				<div class="dropdown-center rounded">
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button
						class="btn btn-light text-dark bg-transparent px-3"
						data-bs-toggle="dropdown"
						title="Тема оформления"><i class="fa-regular fa-sun"></i></button>
					<ul class="dropdown-menu border-0 rounded w-100 bg-light text-dark shadow-sm py-1">
						<button
							class="btn btn-light {!SETTINGS.theme.isSystem && SETTINGS.theme.theme == 'light'
								? 'text-danger'
								: ' text-dark'} w-100 text-start rounded-0 ps-3"
							onclick={async () => changeTheme('light', false)}>Светлая тема</button>
						<button
							class="btn btn-light {!SETTINGS.theme.isSystem && SETTINGS.theme.theme == 'dark'
								? 'text-danger'
								: ' text-dark'} w-100 text-start rounded-0 ps-3"
							onclick={async () => changeTheme('dark', false)}>Тёмная тема</button>
						<button
							class="btn btn-light {SETTINGS.theme.isSystem
								? 'text-danger'
								: ' text-dark'} w-100 text-start rounded-0 ps-3"
							onclick={async () => changeTheme('', true)}>Как в системе</button>
					</ul>
				</div>
				<button
					aria-label="Развернуть/Свернуть"
					title={SETTINGS.ADMIN.isCompactMode ? 'Развернуть' : 'Свернуть'}
					class="btn btn-light text-dark text-start px-3"
					onclick={() => {
						SETTINGS.ADMIN.isCompactMode = !SETTINGS.ADMIN.isCompactMode;
						localStorage.setItem(
							'SETTINGS.ADMIN.isCompactMode',
							String(SETTINGS.ADMIN.isCompactMode)
						);
					}}>
					<i
						class="fa-solid {SETTINGS.ADMIN.isCompactMode
							? 'fa-chevron-right'
							: 'fa-chevron-left'} "></i>
				</button>
			</div>
		</div>
		<div class="flex-grow-1 d-flex flex-column">
			{#if SETTINGS.ADMIN.Header}
				<div class="d-flex flex-column sticky-top">
					<div class="bg-light px-2">
						{@render SETTINGS.ADMIN.Header?.()}
					</div>
				</div>
			{/if}
			<Container>
				{@render children?.()}
			</Container>

			<div class="d-flex justify-content-end fixed-bottom">
				{#if isButtonOnTopShow}
					<a
						class="btn btn-sm btn-dark bg-dark bg-opacity-10 text-dark border-0 mb-3 mx-2 px-3 py-2"
						href="#top">
						<div class="d-flex flex-column">
							<!-- svelte-ignore element_invalid_self_closing_tag -->
							<i class="fa-solid fa-chevron-up" />Наверх
						</div>
					</a>
				{/if}
			</div>
		</div>
	</div>
</IsAuth>

<style>
	.icon-width {
		width: 1.1em;
	}
</style>
