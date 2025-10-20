<script lang="ts">
	import { goto } from '$app/navigation';
	import IsAuth from '$lib/components/IsAuth.svelte';
	import { auth } from '$lib/scripts/firebase';
</script>

<footer class="no-print bg-white text-dark p-3 p-md-4">
	<div class="container flex-grow-1 d-flex flex-column align-items-center flex-wrap row-gap-1">
		<div class="flex-grow-1 d-flex flex-wrap align-items-center justify-content-center gap-1">
			<b class="mb-0">Контакты для связи:</b>
			<div class="d-inline-flex flex-wrap align-items-center justify-content-center gap-1">
				<i>храм:</i>
				<div class="d-flex flex-lg-row flex-wrap text-nowrap align-items-center gap-1">
					<a
						class="badge bg-dark text-light text-decoration-none"
						href="tel:89029346362"
						target="_blank">89029346362</a
					>,
				</div>
			</div>

			<div class="d-inline-flex flex-wrap align-items-center justify-content-center gap-1">
				<i>иерей Алексий (настоятель):</i>
				<div class="d-flex flex-wrap text-nowrap justify-content-center align-items-center gap-1">
					<a
						class="badge bg-success text-decoration-none"
						href="https://api.whatsapp.com/send?phone=79208768928"
						target="_blank">Whatsapp</a>
					<a
						class="badge bg-dark text-light text-decoration-none"
						href="tel:89208768928"
						target="_blank">89208768928</a
					>,
				</div>
			</div>

			<div class="d-inline-flex flex-wrap align-items-center justify-content-center gap-1">
				<i>иерей Сергий:</i>
				<div class="d-flex flex-wrap text-nowrap justify-content-center align-items-center gap-1">
					<a
						class="badge bg-success text-decoration-none"
						href="https://api.whatsapp.com/send?phone=79105163686"
						target="_blank">Whatsapp</a>
					<a
						class="badge bg-dark text-light text-decoration-none"
						href="tel:89105163686"
						target="_blank">89105163686</a>
				</div>
			</div>
		</div>

		{#snippet notAuth()}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<i
				class="fa-solid fa-copyright me-1"
				style="cursor: pointer;"
				title="Вход для администраторов"
				onclick={() => {
					goto('/auth/login');
				}}></i>
		{/snippet}

		<b class="text-center">
			<div class="mb-0">
				<IsAuth {notAuth}>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<i
						class="fa-solid fa-copyright me-1"
						style="cursor: pointer;"
						title="Выйти из аккаунта"
						onclick={() => {
							auth.signOut();
							goto('/');
						}}></i>
				</IsAuth>
				Калужская область, посёлок Бабынино, храм "Вознесения Господня", {new Date().getFullYear()} год
			</div>
		</b>

		<a
			class="btn btn-sm btn-dark bg-dark bg-opacity-10 text-dark border-0 mt-3 mb-1 px-3 py-2"
			href="#top">
			<div class="d-flex flex-column">
				<!-- svelte-ignore element_invalid_self_closing_tag -->
				<i class="fa-solid fa-chevron-up" />Наверх
			</div>
		</a>
	</div>
</footer>
