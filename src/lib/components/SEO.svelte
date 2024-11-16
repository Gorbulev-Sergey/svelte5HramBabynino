<script lang="ts">
	interface IProps {
		title?: string;
		description?: string;
		author?: string;
		copyright?: string;
		address?: string;
		keywords?: string;
	}
	let {
		title = 'Храм Вознесения Господня',
		description = 'Официальный сайт храма Вознесения Господня пос. Бабынино Калужской обл.',
		author = 'Горбулёв Сергей',
		copyright = 'Храм Вознесения Господня',
		address = '249210, Калужская обл., пос. Бабынино, Базарная пл., 1',
		keywords = 'Бабынино храм Вознесения Господня, Бабынино церковь Вознесения Господня, Бабынино храм Вознесения Господня Калуга, Бабынино церковь Вознесения Господня Калуга'
	}: IProps = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="author" content={author} />
	<meta name="copyright" content={copyright} />
	<meta name="address" content={address} />
	<meta name="keywords" content={keywords} />
</svelte:head>
