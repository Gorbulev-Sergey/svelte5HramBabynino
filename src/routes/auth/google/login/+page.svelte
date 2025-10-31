<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/scripts/firebase';
	import { SETTINGS } from '$lib/settings/settings.svelte';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
</script>

<div class="container my-4">
	<div class="d-flex align-items-center justify-content-between">
		<button
			class="btn btn-dark text-light"
			onclick={() => {
				signInWithPopup(auth, new GoogleAuthProvider())
					.then(result => {
						const credential = GoogleAuthProvider.credentialFromResult(result);
						const token = credential?.accessToken;
						const user = result.user;
						SETTINGS.userSigned = user;
						goto('/');
					})
					.catch(error => {
						const errorCode = error.code;
						const errorMessage = error.message;
						const email = error.customData.email;
						const credential = GoogleAuthProvider.credentialFromError(error);
					});
			}}>Войти с помощью Google</button>
		<button
			class="btn btn-dark text-light"
			onclick={() => {
				auth.signOut().then(result => goto('/'));
			}}>Выйти</button>
	</div>
</div>
