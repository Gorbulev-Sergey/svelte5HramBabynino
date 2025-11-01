<script lang="ts">
	import type { Snippet } from 'svelte';

	interface IProps {
		title: String;
		_class?: String;
		children?: Snippet;
	}
	let { title, _class = 'px-4', children }: IProps = $props();
</script>

<div class="d-flex flex-wrap align-items-center no-print pt-3 pb-2 {_class}">
	<h5 class="text-dark mb-0 me-3">
		{title}
	</h5>
	<div class="flex-grow-1 d-flex justify-content-end align-items-center gap-1">
		{@render children?.()}
	</div>
</div>
