<script lang="ts">
	import { type Post } from '$lib/models/Post';
	import EditorControls from './EditorControls.svelte';

	let { post = {} as Post }: { post: Post } = $props();
	let showCode = $state(false);
</script>

<EditorControls
	_class="mb-2"
	codeOnClick={() => {
		showCode = !showCode;
	}}
	code={post.content ?? ''}
	onCodeFormated={v => (post.content = v)} />
{#if !showCode}
	<div
		class="form-control mb-3
					{!post.inverted ? 'bg-light text-dark' : 'bg-dark text-light'}"
		style="min-height: 20em;"
		placeholder="содержимое"
		contenteditable="true"
		bind:innerHTML={post.content}>
	</div>
{:else}
	<textarea
		class="form-control mb-3 {!post.inverted ? 'bg-light text-dark' : 'bg-dark text-light'}"
		style="min-height: 20em;"
		bind:value={post.content}></textarea>
{/if}
