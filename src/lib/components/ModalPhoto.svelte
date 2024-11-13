<script lang="ts">
	interface IProps {
		src: string;
		isShow: boolean;
		onClose(): void;
	}
	let { src, isShow = $bindable(false), onClose }: IProps = $props();
</script>

<div
	class="modal {isShow ? 'show' : 'fade '} bg-dark bg-opacity-75"
	style="width: 100vw; height:100vh">
	<div class="d-flex align-items-center justify-content-center" style="height: 100vh;">
		<div style="width: 75vw!important;">
			<div class="modal-content p-1 border-0 shadow-sm">
				<button
					aria-label="Close"
					class="btn btn-sm btn-light bg-opacity-10 text-dark position-absolute end-0 mt-1 me-2"
					onclick={() => {
						isShow = false;
						onClose();
					}}>
					<i class="fa-solid fa-xmark"></i>
				</button>
				<img class="w-100 rounded" {src} alt="" />
			</div>
		</div>
	</div>
</div>
