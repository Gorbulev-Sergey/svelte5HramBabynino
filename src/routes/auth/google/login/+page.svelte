<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/scripts/firebase';
	import { userSigned } from '$lib/scripts/store';
	import {
		GoogleAuthProvider,
		getRedirectResult,
		signInWithPopup,
		signInWithRedirect,
		signOut
	} from 'firebase/auth';
	import { onMount } from 'svelte';
</script>

<div class="container my-4">
	<div class="d-flex align-items-center justify-content-between">
		<button
			class="btn btn-dark text-light"
			on:click={() => {
				signInWithPopup(auth, new GoogleAuthProvider())
					.then(result => {
						const credential = GoogleAuthProvider.credentialFromResult(result);
						const token = credential?.accessToken;
						const user = result.user;
						$userSigned = user;
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
			on:click={() => {
				auth.signOut().then(result => goto('/'));
			}}>Выйти</button>
	</div>
</div>
