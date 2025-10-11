<script lang="ts">
	import { browser } from '$app/environment';
	import Footer from '$lib/components/Footer.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import { type ITag } from '$lib/models/Tag';
	import { db } from '$lib/scripts/firebase';
	import { showedPostsLength, showedPostsStep } from '$lib/scripts/store';
	import { SETTINGS } from '$lib/store/store.svelte';
	import { onValue, ref } from 'firebase/database';

	let { children } = $props();
	let routesLeft = [
		{
			url: '/posts',
			title: 'Публикации'
		},
		{
			url: '/schedule',
			title: 'Расписание'
		},
		// {
		// 	url: '/posts/св. писание',
		// 	title: 'Святое Писание'
		// },
		{
			url: '/posts/о нашем храме',
			title: 'О храме'
		},

		{
			url: '/posts/видео',
			title: 'Видео'
		},
		{
			url: '/photos',
			title: 'Фотографии'
		},
		{
			url: '/contacts',
			title: 'Контакты'
		}
	];
	let routesRight = [
		{
			url: '/admin/posts',
			title: 'Панель управления'
		}
	];

	SETTINGS.Header = null;

	// Заполняем переменную $showedPostsLength в хранилище
	$effect.pre(() => {
		onValue(ref(db, '/tags'), s =>
			(s.val() as ITag[]).forEach(t => ($showedPostsLength[t.name] = showedPostsStep))
		);
	});
</script>

{#if browser}
	<Navigation
		title="<span class='text-danger'>Храм</span> <span class='text-uppercase'>Вознесения Господня</span>"
		{routesLeft}
		{routesRight} />
	<div class="container-lg mt-0 py-1 overflow-hidden" style="min-height:90vh; margin-bottom:2.7em">
		{@render children?.()}
	</div>

	<Footer />
{/if}
