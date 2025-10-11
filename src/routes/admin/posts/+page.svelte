<script lang="ts">
	import { db } from '$lib/scripts/firebase';
	import { onValue, ref, remove, update } from 'firebase/database';
	import { onDestroy, onMount } from 'svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import TagManager from '$lib/components/tags/TagManager.svelte';
	import { adminPostsFilters, countPostOnAdminPage, EFixedUnfixed } from '$lib/scripts/store.js';
	import FilterTags from '$lib/components/posts/FilterTags.svelte';
	import PinButton from '$lib/components/PinButton.svelte';
	import Pin from '$lib/components/Pin.svelte';
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import { type ITag, Tag } from '$lib/models/Tag';
	import { type IPost, Post as _Post } from '$lib/models/Post';
	import Post from '$lib/components/posts/Post.svelte';
	import { SETTINGS } from '$lib/store/store.svelte';

	let posts: [string, IPost][] = $state([]);
	let tags: ITag[] = $state([]);
	let arrayOfFilteredPosts = $derived.by(() => {
		let p: [string, IPost][] = [];
		switch ($adminPostsFilters.tag.name) {
			case 'все вместе':
				p = $state.snapshot(posts).filter(([k, v]) => v.published == $adminPostsFilters.published);
				break;
			case 'без тега':
				p = $state
					.snapshot(posts)
					.filter(
						([k, v]) =>
							v.published == $adminPostsFilters.published && (v.tags == null || v.tags.length == 0)
					);
				break;
			default:
				p = $state
					.snapshot(posts)
					.filter(
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
	let sizeArrayOfFilteredPosts = $derived(arrayOfFilteredPosts.length);

	let countPostForShow: { [key: string]: number } = $state({});

	onMount(async () => {
		onValue(ref(db, '/tags'), s => {
			if (s.exists()) {
				tags = s.val();
				tags.push(Tag('все вместе', 'Все вместе'));
				tags.push(Tag('без тега', 'Без тега'));

				tags.forEach(t => (countPostForShow[t.name] = $countPostOnAdminPage));
			}
		});
		onValue(ref(db, '/posts'), s => {
			if (s.exists()) {
				posts = Object.entries(s.val());
			}
		});
	});

	SETTINGS.Header = header;
</script>

{#snippet header()}
	<PageTitle title="Публикации">
		<div class="flex-grow-1 d-flex align-items-center flex-wrap gap-1">
			<FilterTags
				title="тег:"
				{tags}
				onSelect={v => ($adminPostsFilters.tag = v)}
				selected={$adminPostsFilters.tag}
				_class="me-1" />
			<PinButton
				bind:pressed={$adminPostsFilters.newFirst}
				_class="btn-sm"
				titleNoPressed="сначала старые"
				titlePressed="сначала новые" />
			<PinButton
				bind:pressed={$adminPostsFilters.published}
				_class="btn-sm"
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
						tags.forEach(t => (countPostForShow[t.name] = $countPostOnAdminPage));
					}}>
					<span>колонки</span>
					<span class="badge bg-light text-dark ms-1">{$countPostOnAdminPage}</span>
				</button>
			</div>
			<div class="flex-grow-1 text-center text-dark">
				Всего публикаций с тегом
				<span class="badge bg-dark bg-opacity-10 text-dark p-1 border-0"
					>{$adminPostsFilters.tag.name}</span>
				- {sizeArrayOfFilteredPosts}
			</div>
		</div>
		<button class="btn btn-dark" onclick={() => goto('/admin/posts/create')}>Создать</button>
	</PageTitle>
{/snippet}

{#snippet post(uid: string, post: IPost)}
	<Post {uid} {post}>
		<div
			class="p-3 bg-dark bg-opacity-10"
			style={post.cover.image || post.cover.video ? 'margin-bottom: -1em;' : ''}>
			<div class="d-flex flex-column align-items-end flex-wrap gap-2">
				<TagManager
					title="Теги:"
					tags={tags.filter((t: ITag) => !post.tags?.find(i => i.name == t.name))}
					bind:selectedTags={post.tags}
					onSelect={() => {
						update(ref(db, `/posts/${uid}`), post);
						invalidateAll();
					}}
					_class={post.inverted ? 'text-dark' : ''} />

				<div class="d-flex justify-content-end flex-wrap">
					<Pin
						classFontAwesome="fa-regular fa-eye"
						text="опубликовать"
						_class="me-2"
						bind:checked={post.published}
						onChange={() => {
							update(ref(db, `/posts/${uid}`), post);
							invalidateAll();
						}} />
					<Pin
						classFontAwesome="fa-solid fa-thumbtack"
						text="закрепить"
						_class="me-2"
						bind:checked={post.pinned}
						onChange={() => {
							update(ref(db, `/posts/${uid}`), post);
							invalidateAll();
						}} />
					<Pin
						classFontAwesome="fa-solid fa-brush"
						text="инвертировать"
						bind:checked={post.inverted}
						onChange={() => {
							update(ref(db, `/posts/${uid}`), post);
							invalidateAll();
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
								onclick={() => {
									remove(ref(db, `/posts/${uid}`));
									invalidateAll();
								}}>Удалить</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Post>
{/snippet}

<div class="row row-cols-1 row-cols-md-{$countPostOnAdminPage} g-3 mb-3">
	<!-- pinned -->
	{#each arrayOfFilteredPosts.filter(([uid, item]) => item.pinned) as [uid, item]}
		{@render post(uid, item)}
	{/each}
</div>

<div class="row row-cols-1 row-cols-md-{$countPostOnAdminPage} g-3">
	<!-- not pinned -->
	{#each arrayOfFilteredPosts
		.filter(([uid, item]) => !item.pinned)
		.slice(0, countPostForShow[$adminPostsFilters.tag.name]) as [uid, item]}
		{@render post(uid, item)}
	{/each}
</div>

{#if countPostForShow[$adminPostsFilters.tag.name] < sizeArrayOfFilteredPosts}
	<button
		class="btn btn-light text-dark w-100 mt-3"
		onclick={() => (countPostForShow[$adminPostsFilters.tag.name] += $countPostOnAdminPage)}
		>Загрузить ещё...</button>
{/if}
