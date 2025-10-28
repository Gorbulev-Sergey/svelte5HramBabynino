<script lang="ts">
	import { isPostUpdated } from '$lib/scripts/store.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Pin from '$lib/components/Pin.svelte';
	import TagManager from '$lib/components/tags/TagManager.svelte';
	import { Tag, type ITag } from '$lib/models/Tag';
	import { db } from '$lib/scripts/firebase';
	import { onValue, ref, update } from 'firebase/database';
	import Editor from '$lib/components/posts/Editor.svelte';
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import SubTitle from '$lib/components/admin/SubTitle.svelte';
	import { SETTINGS } from '$lib/store/store.svelte.js';
	import { onMount } from 'svelte';
	import Selector from '$lib/components/Selector.svelte';
	import { Colors } from '$lib/models/Colors.js';
	import SelectorColors from '$lib/components/SelectorColors.svelte';

	let { data } = $props();
	let tags: ITag[] = $state([]);
	let post = $state(data.post);
	let background = $derived(
		post.inverted
			? 'bg-dark text-light'
			: post.background
				? `bg-${post.background} bg-opacity-25 text-dark`
				: 'bg-white text-dark'
	);

	onMount(async () => {
		SETTINGS.Header = header;
		onValue(ref(db, '/tags'), s => {
			if (s.exists()) {
				tags = Object.values(s.val());
			}
		});
	});
</script>

{#snippet header()}
	<PageTitle title="Редактировать публикацию">
		<button class="btn btn-light" onclick={() => goto(`/admin/posts#${$page.params.uid}`)}
			>Отмена</button>
		<button
			class="btn btn-dark bg-opacity-10"
			onclick={async () => {
				if (post.title != '') {
					update(ref(db, `/posts/${$page.params.uid}`), post);
					$isPostUpdated = true;
					goto('/admin/posts');
				}
			}}>Сохранить</button>
	</PageTitle>
	<SubTitle>
		<div class="d-flex flex-wrap justify-content-between align-items-center">
			<div class="nav nav-pills">
				<a class="btn btn-light border-0 me-1 active" data-bs-toggle="pill" href="#cover"
					>Обложка</a>
				<a class="btn btn-light border-0" data-bs-toggle="pill" href="#content">Содержимое</a>
			</div>
			<div class="d-flex flex-wrap gap-3 me-3">
				<SelectorColors
					title="background"
					list={Object.keys(Colors)}
					bind:selectedItem={post.background} />
				<Pin
					classFontAwesome="fa-regular fa-eye"
					text="опубликовать"
					bind:checked={post.published} />
				<Pin
					classFontAwesome="fa-solid fa-thumbtack"
					text="закрепить наверху"
					bind:checked={post.pinned} />
				<Pin
					classFontAwesome="fa-solid fa-arrows-up-down"
					text="ширина публикации 100%"
					bind:checked={post.isHeightAuto} />
				<Pin
					classFontAwesome="fa-solid fa-brush"
					text="инвертировать цвета"
					bind:checked={post.inverted} />
				{#if post.pinned}
					<Pin
						classFontAwesome="fa-solid fa-ruler-horizontal"
						text="горизонтально"
						bind:checked={post.isHorisontal} />
				{/if}
			</div>
		</div>
	</SubTitle>
{/snippet}

<div class="rounded p-3 {background}">
	<div class="tab-content">
		<div class="tab-pane active show" id="cover">
			<div class="row">
				<div class="col-md-8">
					<input
						class="form-control mb-3
						{!post.inverted ? 'bg-light text-dark' : 'bg-dark text-light'}"
						placeholder="заголовок"
						bind:value={post.title} />
					<textarea
						class="form-control mb-3
						{!post.inverted ? 'bg-light text-dark' : 'bg-dark text-light'}"
						placeholder="краткое описание"
						style="min-height: 10em;"
						bind:value={post.description}></textarea>
					<div class="input-group mb-3">
						<span class="input-group-text bg-dark text-light">Дата публикации</span>
						<input type="date" class="form-control bg-light text-dark" bind:value={post.created} />
					</div>
					<TagManager {tags} bind:selectedTags={post.tags} />
				</div>
				<div class="col-md-4">
					<div class="form-group mb-3">
						{#if post.cover.image}
							<Pin
								classFontAwesome="fa-solid fa-arrows-up-down"
								text="не обрезать ширину фотографии"
								_class="mb-1"
								bind:checked={post.isImageHeightFull} />
						{/if}
						<input
							class="form-control mb-3
						{!post.inverted ? 'bg-light text-dark' : 'bg-dark text-light'}"
							placeholder="обложка (url фото)"
							bind:value={post.cover.image} />
						{#if post.cover.image}
							<img class="card-img rounded" src={post.cover.image} alt="" />
						{/if}
					</div>
					<div class="form-group mb-3">
						<input
							class="form-control mb-3
						{!post.inverted ? 'bg-light text-dark' : 'bg-dark text-light'}"
							placeholder="обложка (url видео)"
							bind:value={post.cover.video} />
						{#if post.cover.video}
							<!-- svelte-ignore legacy_code -->
							<div class="ratio ratio-16x9 rounded overflow-hidden mt-3">
								<!-- svelte-ignore a11y-missing-attribute -->
								{#if post.cover.video.includes('https://youtu.be')}
									<iframe
										title=""
										frameborder="0"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowfullscreen
										class="embed-responsive-item"
										src={post.cover.video.replace('https://youtu.be', 'https://youtube.com/embed')}
									></iframe>
								{:else if post.cover.video.includes('https://vkvideo.ru/video')}
									<iframe
										title=""
										class="embed-responsive-item"
										src={post.cover.video
											.replace(
												'https://vkvideo.ru/video',
												`https://vkvideo.ru/video_ext.php?oid=-${post.cover.video?.split('-')[1]?.split('_')[0]}&id=${post.cover.video?.split('-')[1]?.split('_')[1]}&hash=d46c7611ec96988b`
											)
											.replace('-' + post.cover.video?.split('-')[1], '')}></iframe>
								{:else if post.cover.video.includes('https://rutube.ru/video')}
									<iframe
										title=""
										frameBorder="0"
										allow="clipboard-write; autoplay"
										allowFullScreen
										class="embed-responsive-item"
										src={post.cover.video.replace(
											'https://rutube.ru/video/',
											'https://rutube.ru/play/embed/'
										)}></iframe>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="tab-pane" id="content">
			<Editor bind:post />
		</div>
	</div>
</div>
