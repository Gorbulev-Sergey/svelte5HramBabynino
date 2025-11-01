<script lang="ts">
	interface IProps {
		titleNoPressed?: string;
		titlePressed?: string;
		pressed?: boolean;
		onPressed?: () => void;
		classNoPressed?: string;
		classPressed?: string;
		_class?: string;
	}

	let {
		titleNoPressed = 'кнопка',
		titlePressed = 'кнопка',
		pressed = $bindable(false),
		onPressed = () => {},
		classNoPressed = 'btn-dark',
		classPressed = 'btn-dark',
		_class = ''
	}: IProps = $props();
</script>

<button
	class="btn {pressed ? classPressed : classNoPressed} {_class}"
	onclick={() => {
		pressed = !pressed;
		onPressed();
	}}>
	{pressed ? titlePressed : titleNoPressed}
</button>
