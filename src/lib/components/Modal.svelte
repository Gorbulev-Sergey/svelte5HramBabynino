<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

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

	$effect(() => {
		if (isModalShow) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	});
</script>

<div
	class="modal {isModalShow ? 'show' : 'fade'} bg-light bg-opacity-75"
	style="display: {isModalShow ? 'block' : 'none'}; z-index: 20000">
	<div
		class="modal-dialog modal-dialog-centered {isFullScreen
			? 'modal-fullscreen'
			: 'modal-dialog-scrollable'} {_class}"
		tabindex="-1">
		<div class="modal-content border-0 shadow-sm bg-light text-dark">
			<button
				aria-label=""
				class="btn btn-light text-dark border-0 position-absolute z-2"
				style="top: .5em; right: .5em"
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
