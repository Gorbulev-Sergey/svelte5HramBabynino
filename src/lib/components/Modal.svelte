<script lang="ts">
	import type { Snippet } from 'svelte';
	import { scale } from 'svelte/transition';

	interface IProps {
		children?: Snippet;
		isModalShow: boolean;
		onClose?: () => void;
		_class?: string;
		isFullScreen?: boolean;
	}
	let {
		children,
		isModalShow = $bindable(false),
		onClose = () => {},
		_class = '',
		isFullScreen = false
	}: IProps = $props();
</script>

<div
	class="modal {isModalShow ? 'show' : 'fade'} bg-light bg-opacity-75"
	style="display: {isModalShow ? 'block' : 'none'};">
	<div
		class="modal-dialog modal-dialog-centered {isFullScreen
			? 'modal-fullscreen'
			: 'modal-dialog-scrollable'} {_class}"
		tabindex="-1">
		<div transition:scale class="modal-content border-0 shadow-sm bg-white text-dark p-1">
			<button
				aria-label=""
				class="btn btn-sm bg-transparent border-0 text-dark position-absolute z-2 top-0 end-0"
				onclick={() => {
					isModalShow = false;
					onClose();
				}}>
				<i class="fa-solid fa-xmark"></i>
			</button>
			<div class="d-flex flex-column gap-2 p-3">
				{@render children?.()}
			</div>
		</div>
	</div>
</div>
