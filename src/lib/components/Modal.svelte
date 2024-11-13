<script lang="ts">
	import type { Snippet } from 'svelte';

	interface IProps {
		title?: string;
		children?: Snippet;
		isShow: boolean;
		onClose?: () => {};
	}
	let { title, children, isShow = false, onClose }: IProps = $props();
</script>

<div class="modal {isShow ? 'show' : 'fade'}">
	<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" tabindex="-1">
		<div class="modal-content border-0 shadow-sm">
			<div class="d-flex align-items-center justify-content-between position-relative">
				{#if title}
					<h5 class="modal-title">{title}</h5>
				{/if}
				<button
					type="button"
					class="btn-close {!title ? 'position-absolute z-2 top-0 end-0 p-2' : ''}"
					data-bs-dismiss="modal"
					aria-label="Close"
					onclick={() => onClose}></button>
			</div>
			<div class="modal-body p-1">
				{@render children?.()}
			</div>
		</div>
	</div>
</div>
