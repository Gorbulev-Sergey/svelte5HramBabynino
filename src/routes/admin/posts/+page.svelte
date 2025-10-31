<script lang="ts">
	import { db } from '$lib/scripts/firebase';
	import { onValue, ref, remove, update } from 'firebase/database';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import TagManager from '$lib/components/tags/TagManager.svelte';
	import FilterTags from '$lib/components/posts/FilterTags.svelte';
	import PinButton from '$lib/components/PinButton.svelte';
	import Pin from '$lib/components/Pin.svelte';
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import { type ITag, Tag } from '$lib/models/Tag';
	import { type IPost, Post as _Post } from '$lib/models/Post';
	import Post from '$lib/components/posts/Post.svelte';
	import { EFixedUnfixed, SETTINGS } from '$lib/settings/settings.svelte';

	let posts: [string, IPost][] = $state([]);
	let tags: ITag[] = $state([]);
	let arrayOfFilteredPosts = $derived.by(() => {
		let p: [string, IPost][] = [];
		switch (SETTINGS.ADMIN.posts.filters.tag.name) {
			case 'все вместе':
				p = posts.filter(([k, v]) => v.published == SETTINGS.ADMIN.posts.filters.published);
				break;
			case 'без тега':
				p = posts.filter(
					([k, v]) =>
						v.published == SETTINGS.ADMIN.posts.filters.published &&
						(v.tags == null || v.tags.length == 0)
				);
				break;
			default:
				p = posts.filter(
					([k, v]) =>
						v.published == SETTINGS.ADMIN.posts.filters.published &&
						v.tags?.find(t => t.name == SETTINGS.ADMIN.posts.filters.tag.name)
				);
				break;
		}
		switch (SETTINGS.ADMIN.posts.filters.newFirst) {
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
		switch (SETTINGS.ADMIN.posts.filters.fixedUnfixed) {
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
		SETTINGS.ADMIN.Header = header;
		onValue(ref(db, '/tags'), s => {
			if (s.exists()) {
				tags = Object.values(s.val());
				tags.push(Tag('все вместе', 'Все вместе'));
				tags.push(Tag('без тега', 'Без тега'));
				tags.forEach(t => (countPostForShow[t.name] = SETTINGS.ADMIN.posts.columns));
			}
		});
		onValue(ref(db, '/posts'), s => {
			if (s.exists()) {
				posts = Object.entries(s.val());
			}
		});
	});
</script>

{#snippet header()}
	<PageTitle title="Публикации">
		<div class="flex-grow-1 d-flex align-items-center flex-wrap gap-1">
			<FilterTags
				title="тег:"
				{tags}
				onSelect={v => (SETTINGS.ADMIN.posts.filters.tag = v)}
				selected={SETTINGS.ADMIN.posts.filters.tag}
				_class="me-1" />
			<PinButton
				bind:pressed={SETTINGS.ADMIN.posts.filters.newFirst}
				_class="btn-sm"
				titleNoPressed="сначала старые"
				titlePressed="сначала новые" />
			<PinButton
				bind:pressed={SETTINGS.ADMIN.posts.filters.published}
				_class="btn-sm"
				titleNoPressed="не опубликованные"
				titlePressed="опубликованные" />
			<div class="d-flex align-items-center gap-1">
				<button
					class="btn btn-sm btn-dark text-light"
					onclick={() => {
						switch (SETTINGS.ADMIN.posts.filters.fixedUnfixed) {
							case EFixedUnfixed['закреплённые']:
								SETTINGS.ADMIN.posts.filters.fixedUnfixed = EFixedUnfixed['незакреплённые'];
								break;
							case EFixedUnfixed['незакреплённые']:
								SETTINGS.ADMIN.posts.filters.fixedUnfixed =
									EFixedUnfixed['закреплённые и незакреплённые'];
								break;
							case EFixedUnfixed['закреплённые и незакреплённые']:
								SETTINGS.ADMIN.posts.filters.fixedUnfixed = EFixedUnfixed['закреплённые'];
								break;
						}
					}}>
					<span>{EFixedUnfixed[SETTINGS.ADMIN.posts.filters.fixedUnfixed]}</span>
				</button>
				<button
					class="btn btn-sm btn-dark text-light"
					onclick={() => {
						if (SETTINGS.ADMIN.posts.columns == SETTINGS.ADMIN.posts.columns) {
							SETTINGS.ADMIN.posts.columns = 1;
						} else SETTINGS.ADMIN.posts.columns++;
						localStorage.setItem('countPostOnAdminPage', String(SETTINGS.ADMIN.posts.columns));
						tags.forEach(t => (countPostForShow[t.name] = SETTINGS.ADMIN.posts.columns));
					}}>
					<span>колонки</span>
					<span class="badge bg-light text-dark ms-1">{SETTINGS.ADMIN.posts.columns}</span>
				</button>
			</div>
			<div class="flex-grow-1 text-center text-dark">
				Всего публикаций с тегом
				<span class="badge bg-dark bg-opacity-10 text-dark p-1 border-0"
					>{SETTINGS.ADMIN.posts.filters.tag.name}</span>
				- {sizeArrayOfFilteredPosts}
			</div>
		</div>
		<button class="btn btn-dark" onclick={() => goto('/admin/posts/create')}>Создать</button>
	</PageTitle>
{/snippet}

{#snippet post(uid: string, post: IPost)}
	<Post {uid} {post} _class="border-3 border-light" isTagsShow={false}>
		<div
			class="p-2 bg-body-secondary bg-opacity-50 text-dark"
			style={post.cover?.image || post.cover?.video ? 'margin-bottom: -.5em;' : ''}>
			<div class="d-flex flex-column align-items-center flex-wrap gap-1">
				<TagManager
					title="Теги:"
					tags={tags.filter((t: ITag) => !post.tags?.find(i => i.name == t.name))}
					bind:selectedTags={post.tags}
					onSelect={() => {
						update(ref(db, `/posts/${uid}`), post);
					}}
					_class={post.inverted ? 'text-dark' : ''} />
				<div class="d-flex justify-content-center flex-wrap">
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
								onclick={() => {
									remove(ref(db, `/posts/${uid}`));
								}}>Удалить</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Post>
{/snippet}

<div class="row row-cols-1 row-cols-md-{SETTINGS.ADMIN.posts.columns} g-3 mb-3">
	<!-- pinned -->
	{#each [...arrayOfFilteredPosts].filter(([uid, item]) => item.pinned) as [uid, item]}
		{@render post(uid, item)}
	{/each}
</div>

<div class="row row-cols-1 row-cols-md-{SETTINGS.ADMIN.posts.columns} g-3">
	<!-- not pinned -->
	{#each [...arrayOfFilteredPosts]
		.filter(([uid, item]) => !item.pinned)
		.slice(0, countPostForShow[SETTINGS.ADMIN.posts.filters.tag.name]) as [uid, item]}
		{@render post(uid, item)}
	{/each}
</div>

{#if countPostForShow[SETTINGS.ADMIN.posts.filters.tag.name] < sizeArrayOfFilteredPosts}
	<button
		class="btn btn-light text-dark w-100 mt-3"
		onclick={() =>
			(countPostForShow[SETTINGS.ADMIN.posts.filters.tag.name] += SETTINGS.ADMIN.posts.columns)}
		>Загрузить ещё...</button>
{/if}
