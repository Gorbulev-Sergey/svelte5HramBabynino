<script lang="ts">
	interface IProps {
		src: string;
		isShow: boolean;
		onClose(): void;
	}
	let { src, isShow = $bindable(false), onClose }: IProps = $props();
</script>
