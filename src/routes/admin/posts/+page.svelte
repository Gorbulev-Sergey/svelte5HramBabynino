<script lang="ts">
	import { db } from '$lib/scripts/firebase';
	import { ref, remove, update } from 'firebase/database';
	import PostHorizontal from '$lib/components/posts/PostHorizontal.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import TagManager from '$lib/components/tags/TagManager.svelte';
	import { adminPostsFilters, Header, isPostUpdated } from '$lib/scripts/store.js';
	import FilterTags from '$lib/components/posts/FilterTags.svelte';
	import PinButton from '$lib/components/PinButton.svelte';
	import Pin from '$lib/components/Pin.svelte';
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import { Tag } from '$lib/models/Tag';
	import Post from '$lib/components/posts/Post.svelte';

	export let data;
	$: posts = data.posts;
	$: tags = data.tags;
	$: arrayOfFilteredPosts = () => {
		let p;
		switch ($adminPostsFilters.tag.name) {
			case 'все вместе':
				p = Object.entries(posts).filter(([k, v]) => v.published == $adminPostsFilters.published);
				break;
			case 'без тега':
				p = Object.entries(posts).filter(
					([k, v]) =>
						v.published == $adminPostsFilters.published && (v.tags == null || v.tags.length == 0)
				);
				break;
			default:
				p = Object.entries(posts).filter(
					([k, v]) =>
						v.published == $adminPostsFilters.published &&
						v.tags?.find(t => t.name == $adminPostsFilters.tag.name)
				);
				break;
		}

		switch ($adminPostsFilters.newFirst) {
			case true:
				return p.sort(
					([k1, v1], [k2, v2]) => new Date(v2.created).getTime() - new Date(v1.created).getTime()
				);
			case false:
				return p.sort(
					([k1, v1], [k2, v2]) => new Date(v1.created).getTime() - new Date(v2.created).getTime()
				);
		}
	};

	$Header = header;

	onMount(async () => {
		if ($isPostUpdated) {
			$isPostUpdated = false;
			invalidateAll();
		}
		tags.push(new Tag('все вместе', 'Все вместе'));
		tags.push(new Tag('без тега', 'Без тега'));
		document.addEventListener('visibilitychange', function () {
			if (!document.hidden) {
				invalidateAll();
			}
		});
	});
	onDestroy(() => ($Header = null));
</script>

{#snippet header()}
	<PageTitle title="Публикации">
		<div class="flex-grow-1 d-flex align-items-center">
			<FilterTags
				title="тип:"
				{tags}
				onSelect={v => ($adminPostsFilters.tag = v)}
				selected={$adminPostsFilters.tag}
				_class="me-1" />
			<PinButton
				bind:pressed={$adminPostsFilters.newFirst}
				_class="btn-sm me-1"
				titleNoPressed="сначала старые"
				titlePressed="сначала новые" />
			<PinButton
				bind:pressed={$adminPostsFilters.published}
				_class="btn-sm me-1"
				titleNoPressed="не опубликованные"
				titlePressed="опубликованные" />
		</div>
		<button class="btn btn-dark" on:click={() => goto('/admin/posts/create')}>Создать</button>
	</PageTitle>
{/snippet}

<div class="bg-white rounded p-3">
	<div class="row row-cols-1 row-cols-md-3 g-3 mb-3">
		<!-- pinned -->
		{#each arrayOfFilteredPosts().filter(([uid, item]) => item.pinned) as [uid, item]}
			<div class="col">
				<Post {uid} post={item}>
					<div class="card-body">
						<div class="d-flex justify-content-between align-items-center flex-wrap">
							<div class="d-flex me-3">
								<TagManager
									title="Теги:"
									tags={tags.filter(t => !item.tags?.find(i => i.name == t.name))}
									bind:selectedTags={item.tags}
									onSelect={() => update(ref(db, `/posts/${uid}`), item)}
									_class={item.inverted ? 'text-dark' : ''} />
							</div>
							<div class="d-flex mb-2 flex-wrap">
								<div class="d-flex me-3">
									<Pin
										classFontAwesome="fa-regular fa-eye"
										text="опубликовать"
										_class="me-2"
										bind:checked={item.published}
										onChange={() => {
											update(ref(db, `/posts/${uid}`), item);
										}} />
									<Pin
										classFontAwesome="fa-solid fa-thumbtack"
										text="закрепить"
										_class="me-2"
										bind:checked={item.pinned}
										onChange={() => {
											update(ref(db, `/posts/${uid}`), item);
										}} />
									<Pin
										classFontAwesome="fa-solid fa-brush"
										text="инвертировать"
										bind:checked={item.inverted}
										onChange={() => {
											update(ref(db, `/posts/${uid}`), item);
										}} />
								</div>
								<div class="d-flex">
									<button
										class="btn btn-sm btn-light me-1"
										on:click={() => goto(`/admin/posts/edit/${uid}`)}
										><i class="fa-solid fa-pencil"></i></button>
									<div class="dropdown dropend">
										<button class="btn btn-sm btn-light" data-bs-toggle="dropdown">
											<i class="fa-solid fa-trash text-danger"></i>
										</button>
										<div class="dropdown-menu p-2 text-center">
											<p>Вы действительно хотите удалить эту публикацию?</p>
											<button class="btn btn-sm btn-light" data-bs-toggle="dropdown">Отмена</button>
											<button
												class="btn btn-sm btn-light text-danger"
												data-bs-toggle="dropdown"
												on:click={() => remove(ref(db, `/posts/${uid}`))}>Удалить</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Post>
			</div>
		{/each}
	</div>

	<div class="row row-cols-1 row-cols-md-3 g-3">
		<!-- not pinned -->
		{#each arrayOfFilteredPosts().filter(([uid, post]) => !post.pinned) as [uid, post]}
			<div class="col">
				<Post {uid} {post}>
					<div class="p-3 bg-dark bg-opacity-10" style="margin-bottom: -1em;">
						<div class="d-flex flex-column align-items-end flex-wrap gap-2">
							<div class="d-flex">
								<TagManager
									title="Теги:"
									tags={tags.filter(t => !post.tags?.find(i => i.name == t.name))}
									bind:selectedTags={post.tags}
									onSelect={() => update(ref(db, `/posts/${uid}`), post)}
									_class={post.inverted ? 'text-dark' : ''} />
							</div>
							<div class="d-flex">
								<Pin
									classFontAwesome="fa-regular fa-eye"
									text="опубликовать"
									_class="me-2"
									bind:checked={post.published}
									onChange={() => {
										update(ref(db, `/posts/${uid}`), post);
									}} />
								<Pin
									classFontAwesome="fa-solid fa-thumbtack"
									text="закрепить"
									_class="me-2"
									bind:checked={post.pinned}
									onChange={() => {
										update(ref(db, `/posts/${uid}`), post);
									}} />
								<Pin
									classFontAwesome="fa-solid fa-brush"
									text="инвертировать"
									bind:checked={post.inverted}
									onChange={() => {
										update(ref(db, `/posts/${uid}`), post);
									}} />
							</div>
							<div class="d-flex">
								<button
									class="btn btn-sm btn-light me-1"
									on:click={() => goto(`/admin/posts/edit/${uid}`)}
									><i class="fa-solid fa-pencil" /></button>
								<div class="dropdown dropend">
									<button class="btn btn-sm btn-light" data-bs-toggle="dropdown"
										><i class="fa-solid fa-trash text-danger" /></button>
									<div class="dropdown-menu p-2 text-center">
										<p>Вы действительно хотите удалить эту публикацию?</p>
										<button class="btn btn-sm btn-light" data-bs-toggle="dropdown">Отмена</button>
										<button
											class="btn btn-sm btn-light text-danger"
											data-bs-toggle="dropdown"
											on:click={() => remove(ref(db, `/posts/${uid}`))}>Удалить</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Post>
			</div>
		{/each}
	</div>
</div>
