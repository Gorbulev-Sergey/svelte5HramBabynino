<script lang="ts">
	import { db } from '$lib/scripts/firebase';
	import { ref, remove, update } from 'firebase/database';
	import { onDestroy, onMount } from 'svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import TagManager from '$lib/components/tags/TagManager.svelte';
	import {
		adminPostsFilters,
		countPostOnAdminPage,
		EFixedUnfixed,
		Header,
		isPostUpdated
	} from '$lib/scripts/store.js';
	import FilterTags from '$lib/components/posts/FilterTags.svelte';
	import PinButton from '$lib/components/PinButton.svelte';
	import Pin from '$lib/components/Pin.svelte';
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import { type Tag as _Tag } from '$lib/models/Tag';
	import { type IPost } from '$lib/models/Post';
	import Post from '$lib/components/posts/Post.svelte';

	let { data } = $props();
	let posts = $derived(data.posts);
	let tags = $derived(data.tags);
	let arrayOfFilteredPosts = $derived.by(() => {
		let p: [string, IPost][];
		switch ($adminPostsFilters.tag.name) {
			case 'все вместе':
				p = posts.filter(([k, v]) => v.published == $adminPostsFilters.published);
				break;
			case 'без тега':
				p = posts.filter(
					([k, v]) =>
						v.published == $adminPostsFilters.published && (v.tags == null || v.tags.length == 0)
				);
				break;
			default:
				p = posts.filter(
					([k, v]) =>
						v.published == $adminPostsFilters.published &&
						v.tags?.find(t => t.name == $adminPostsFilters.tag.name)
				);
				break;
		}
		switch ($adminPostsFilters.newFirst) {
			case true:
				p = p.sort(
					([k1, v1], [k2, v2]) => new Date(v2.created).getTime() - new Date(v1.created).getTime()
				);
				break;
			case false:
				p = p.sort(
					([k1, v1], [k2, v2]) => new Date(v1.created).getTime() - new Date(v2.created).getTime()
				);
				break;
		}
		switch ($adminPostsFilters.fixedUnfixed) {
			case EFixedUnfixed['закреплённые']:
				p = p.filter(v => v[1].pinned);
				break;
			case EFixedUnfixed['незакреплённые']:
				p = p.filter(v => !v[1].pinned);
				break;
			case EFixedUnfixed['закреплённые и незакреплённые']:
				break;
		}
		return p;
	});

	$Header = header;

	$effect.pre(() => {
		if ($isPostUpdated) {
			$isPostUpdated = false;
			invalidateAll();
		}
		tags.push({ name: 'все вместе', description: 'Все вместе' });
		tags.push({ name: 'без тега', description: 'Без тега' });
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
				title="тег:"
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
			<div class="d-flex align-items-center gap-1">
				<button
					class="btn btn-sm btn-dark text-light"
					onclick={() => {
						switch ($adminPostsFilters.fixedUnfixed) {
							case EFixedUnfixed['закреплённые']:
								$adminPostsFilters.fixedUnfixed = EFixedUnfixed['незакреплённые'];
								break;
							case EFixedUnfixed['незакреплённые']:
								$adminPostsFilters.fixedUnfixed = EFixedUnfixed['закреплённые и незакреплённые'];
								break;
							case EFixedUnfixed['закреплённые и незакреплённые']:
								$adminPostsFilters.fixedUnfixed = EFixedUnfixed['закреплённые'];
								break;
						}
					}}>
					<span>{EFixedUnfixed[$adminPostsFilters.fixedUnfixed]}</span>
				</button>
				<button
					class="btn btn-sm btn-dark text-light"
					onclick={() => {
						if ($countPostOnAdminPage == 5) {
							$countPostOnAdminPage = 1;
						} else $countPostOnAdminPage++;
						localStorage.setItem('countPostOnAdminPage', String($countPostOnAdminPage));
					}}>
					<span>колонки</span>
					<span class="badge bg-light text-dark ms-1">{$countPostOnAdminPage}</span>
				</button>
			</div>
		</div>
		<button class="btn btn-dark" onclick={() => goto('/admin/posts/create')}>Создать</button>
	</PageTitle>
{/snippet}

{#snippet post(uid: string, post: IPost)}
	<Post {uid} {post}>
		<div
			class="p-3 bg-dark bg-opacity-10"
			style={post.cover?.image || post.cover?.video ? 'margin-bottom: -1em;' : ''}>
			<div class="d-flex flex-column align-items-end flex-wrap gap-2">
				<TagManager
					title="Теги:"
					tags={tags.filter(t => !post.tags?.find(i => i.name == t.name))}
					bind:selectedTags={post.tags}
					onSelect={() => update(ref(db, `/posts/${uid}`), post)}
					_class={post.inverted ? 'text-dark' : ''} />

				<div class="d-flex justify-content-end flex-wrap">
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
				<div class="d-flex flex-wrap">
					<button
						aria-label=""
						class="btn btn-sm btn-light me-1"
						onclick={() => goto(`/admin/posts/edit/${uid}`)}>
						<i class="fa-solid fa-pencil"></i>
					</button>
					<div class="dropdown dropend">
						<button aria-label="" class="btn btn-sm btn-light" data-bs-toggle="dropdown">
							<i class="fa-solid fa-trash text-danger"></i>
						</button>
						<div class="dropdown-menu p-2 text-center">
							<p>Вы действительно хотите удалить эту публикацию?</p>
							<button class="btn btn-sm btn-light" data-bs-toggle="dropdown">Отмена</button>
							<button
								class="btn btn-sm btn-light text-danger"
								data-bs-toggle="dropdown"
								onclick={() => remove(ref(db, `/posts/${uid}`))}>Удалить</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Post>
{/snippet}

<div class="bg-white rounded p-3">
	<div class="row row-cols-1 row-cols-md-{$countPostOnAdminPage} g-3 mb-3">
		<!-- pinned -->
		{#each arrayOfFilteredPosts.filter(([uid, item]) => item.pinned) as [uid, item]}
			{@render post(uid, item)}
		{/each}
	</div>

	<div class="row row-cols-1 row-cols-md-{$countPostOnAdminPage} g-3">
		<!-- not pinned -->
		{#each arrayOfFilteredPosts.filter(([uid, item]) => !item.pinned) as [uid, item]}
			{@render post(uid, item)}
		{/each}
	</div>
</div>
