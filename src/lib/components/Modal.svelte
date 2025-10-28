<script lang="ts">
	import { type Snippet } from 'svelte';

	interface IProps {
		children?: Snippet;
		isModalShow: boolean;
		onClose?: () => void;
		_class?: string;
		isFullScreen?: boolean;
		isBackgroundLight?: boolean;
	}
	let {
		children,
		isModalShow = $bindable(false),
		onClose = () => {},
		_class = '',
		isFullScreen = false,
		isBackgroundLight = true
	}: IProps = $props();

	let background = $derived(isBackgroundLight ? 'bg-light text-dark' : 'bg-dark text-light');
	let backgroundButton = $derived(
		isBackgroundLight ? 'btn-light text-dark' : 'btn-dark text-light'
	);

	$effect(() => {
		if (isModalShow) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	});
</script>

<div
	class="modal {isModalShow ? 'show' : 'fade'} {background} bg-opacity-75"
	style="display: {isModalShow ? 'block' : 'none'}; z-index: 20000; backdrop-filter: blur(.15em);">
	<div
		class="modal-dialog modal-dialog-centered {isFullScreen
			? 'modal-fullscreen'
			: 'modal-dialog-scrollable'} {_class}"
		tabindex="-1">
		<div
			class="modal-content shadow-sm {background} border-secondary border-opacity-10"
			style="border-width: 0;">
			<button
				aria-label="Отмена"
				class="btn {backgroundButton} position-absolute z-2"
				style="top: .5em; right: .5em"
				onclick={() => {
					isModalShow = false;
					onClose();
				}}>
				<i class="fa-solid fa-xmark"></i>
			</button>
			<div class="modal-content {background} border-secondary border-opacity-10 p-3">
				{@render children?.()}
			</div>
		</div>
	</div>
</div>
