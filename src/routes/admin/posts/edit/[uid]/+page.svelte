<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Pin from '$lib/components/Pin.svelte';
	import TagManager from '$lib/components/tags/TagManager.svelte';
	import { Tag } from '$lib/models/Tag';
	import { db } from '$lib/scripts/firebase';
	import { ref, update } from 'firebase/database';
	import Editor from '$lib/components/posts/Editor.svelte';
	import PageTitleWrap from '$lib/components/PageTitleWrap.svelte';

	let { data } = $props();
	let tags = data.tags;
	let post = $state(data.post);
	let selectedTag = $state(new Tag());
</script>

<PageTitleWrap title="Редактировать публикацию">
	<div slot="navigation">
		<button class="btn btn-light" onclick={() => goto(`/admin/posts#${$page.params.uid}`)}
			>Отмена</button>
		<button
			class="btn btn-dark bg-opacity-10"
			onclick={async () => {
				if (post.title != '') {
					update(ref(db, `/posts/${$page.params.uid}`), post);
					goto('/admin/posts');
				}
			}}>Сохранить</button>
	</div>
</PageTitleWrap>

<div class="rounded p-3 {!post.inverted ? 'bg-white text-dark' : 'bg-dark text-light'}">
	<div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
		<div class="nav nav-pills">
			<a class="btn btn-light border-0 me-1 active" data-bs-toggle="pill" href="#cover">Обложка</a>
			<a class="btn btn-light border-0" data-bs-toggle="pill" href="#content">Содержимое</a>
		</div>
		<div class="d-flex flex-wrap">
			<Pin
				classFontAwesome="fa-regular fa-eye"
				text="опубликовать"
				_class="me-4"
				bind:checked={post.published} />
			<Pin
				classFontAwesome="fa-solid fa-thumbtack"
				text="закрепить наверху"
				_class="me-4"
				bind:checked={post.pinned} />
			<Pin
				classFontAwesome="fa-solid fa-arrows-up-down"
				text="ширина публикации 100%"
				_class="me-4"
				bind:checked={post.isHeightAuto} />
			<Pin
				classFontAwesome="fa-solid fa-brush"
				text="инвертировать цвета"
				_class="me-4"
				bind:checked={post.inverted} />
			{#if post.pinned}
				<Pin
					classFontAwesome="fa-solid fa-ruler-horizontal"
					text="горизонтально"
					bind:checked={post.isHorisontal} />
			{/if}
		</div>
	</div>

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
								{:else if post.cover.video.includes('https://vk.com/video')}
									<iframe
										title=""
										class="embed-responsive-item"
										src={post.cover.video
											.replace(
												'https://vk.com/video',
												`https://vk.com/video_ext.php?oid=-${post.cover.video?.split('-')[1]?.split('_')[0]}&id=${post.cover.video?.split('-')[1]?.split('_')[1]}&hash=d46c7611ec96988b`
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
			<Editor {post} />
		</div>
	</div>
</div>
