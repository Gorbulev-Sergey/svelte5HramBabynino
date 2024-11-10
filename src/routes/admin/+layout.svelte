<script lang="ts">
	import { subPanel } from '$lib/scripts/store';
	import Alerts from '$lib/components/Alerts.svelte';
	import Container from '$lib/components/Container.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import IsAuth from '$lib/components/IsAuth.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import { User } from '$lib/models/admin/User';
	import { auth, db } from '$lib/scripts/firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import { onValue, ref } from 'firebase/database';
	import { onMount, type Snippet } from 'svelte';

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
			url: '/admin/tags',
			title: 'Теги'
		},
		{
			url: '/admin/contacts',
			title: 'Контакты'
		},
		{
			url: '/admin/storage',
			title: 'Хранилище'
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
	});
</script>

<IsAuth>
	<Navigation
		title="Панель управления"
		routesLeft={isCurrentUserAdmin ? [...routesLeft, ...routesOnlyForAdmins] : routesLeft}
		{routesRight}>
		{@render $subPanel?.()}
	</Navigation>
	<div class="container mt-1 mb-4" style="min-height:90vh;">
		<Container>
			{@render children?.()}
		</Container>
	</div>
	<Footer />
	<Alerts />
</IsAuth>
