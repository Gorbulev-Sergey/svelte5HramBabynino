<script lang="ts">
	import type { Snippet } from 'svelte';

	interface IProps {
		titleSpecial?: string;
		title?: string;
		description?: string;
		author?: string;
		copyright?: string;
		address?: string;
		keywords?: string;
		_class?: string;
		children?: Snippet;
		center?: Snippet;
	}

	let {
		titleSpecial = '',
		title = 'Публикации',
		description = 'Официальный сайт храма Вознесения Господня пос. Бабынино Калужской обл.',
		author = 'Горбулёв Сергей',
		copyright = 'Храм Вознесения Господня',
		address = '249210, Калужская обл., пос. Бабынино, Базарная пл., 1',
		keywords = 'Бабынино храм Вознесения Господня, Бабынино церковь Вознесения Господня, Бабынино храм Вознесения Господня Калуга, Бабынино церковь Вознесения Господня Калуга',
		_class = '',
		children,
		center
	}: IProps = $props();
</script>

<svelte:head>
	<title>{titleSpecial == '' ? title : titleSpecial}</title>
	<meta name="description" content={description} />
	<meta name="author" content={author} />
	<meta name="copyright" content={copyright} />
	<meta name="address" content={address} />
	<meta name="keywords" content={keywords} />
</svelte:head>

<div
	class="d-flex justify-content-between flex-lg-nowrap flex-wrap align-items-start mb-3 no-print mx-1 {_class}">
	<div class="d-flex justify-content-between align-items-baseline">
		<h4 class="text-dark ms-1 mb-0 me-3 text-nowrap fw-bold" style="font-size:1.5em">
			{@html title}
		</h4>
		{@render center?.()}
	</div>
	{@render children?.()}
</div>
