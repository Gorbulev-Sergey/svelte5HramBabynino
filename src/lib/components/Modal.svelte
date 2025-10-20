<script lang="ts">
	import type { Snippet } from 'svelte';

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
		<div class="modal-content border-0 shadow-sm bg-light text-dark p-1">
			<button
				aria-label=""
				class="btn btn bg-transparent border-0 text-dark position-absolute z-2 top-0 end-0"
				onclick={() => {
					isModalShow = false;
					onClose();
				}}>
				<i class="fa-solid fa-xmark"></i>
			</button>
			<div class="modal-content bg-light text-dark p-3">
				{@render children?.()}
			</div>
		</div>
	</div>
</div>
