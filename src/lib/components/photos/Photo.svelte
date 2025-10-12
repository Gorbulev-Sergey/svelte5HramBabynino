<script lang="ts">
	import { type IPhoto, Photo } from '$lib/models/photos/Photo';
	import type { Snippet } from 'svelte';

	interface Props {
		photo: IPhoto;
		_class?: String;
		onUp?: () => void;
		onDown?: () => void;
		onDelete?: () => void;
		children?: Snippet;
	}
	let {
		photo = $bindable(Photo()),
		_class = '',
		onUp = () => {},
		onDown = () => {},
		onDelete = () => {},
		children = undefined
	}: Props = $props();
</script>

<div
	class="img-fluid rounded d-flex flex-column {_class}"
	style="background-image: url({photo.url});
		background-repeat: no-repeat; background-position: center; background-size: cover; min-height:16em;">
	<div class="flex-grow-1 d-flex justify-content-end align-items-start m-3">
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<button class="btn btn-sm btn-dark" onclick={() => onDelete()}>
			<i class="fa-solid fa-trash text-danger"></i>
		</button>
	</div>
	<div class="d-flex justify-content-between bg-dark text-light bg-opacity-25 p-3 rounded-bottom">
		<div class=" flex-grow-1">
			<input
				class="form-control form-control-sm border-0 mb-1 bg-light text-dark bg-opacity-75"
				placeholder="url"
				bind:value={photo.url} />
			<input
				class="form-control form-control-sm border-0 bg-light text-dark bg-opacity-75"
				placeholder="заголовок"
				bind:value={photo.title} />
		</div>
		<div class="btn-group ms-3">
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button class="btn btn-sm btn-dark me-1" onclick={() => onUp()}
				><i class="fa-solid fa-angle-left text-light"></i></button>
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button class="btn btn-sm btn-dark" onclick={() => onDown()}
				><i class="fa-solid fa-angle-right text-light"></i></button>
		</div>
	</div>
	{@render children?.()}
</div>
