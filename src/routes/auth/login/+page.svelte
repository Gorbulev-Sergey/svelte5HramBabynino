<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, db } from '$lib/settings/firebase';
	import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
	import { onValue, ref } from 'firebase/database';

	let credential = $state({ email: '', password: '' });
	let errorMessage = $state('');

	function login() {
		checkEmailAndPassword();
		if (
			credential.email.trim() !== '' &&
			credential.email.includes('@') &&
			credential.email.includes('.') &&
			credential.password.trim() !== '' &&
			credential.password.length > 3
		) {
			signInWithEmailAndPassword(auth, credential.email, credential.password).then(r => {
				onValue(ref(db, '/admins'), s => {
					if (s.exists() && auth.currentUser) {
						if (s.hasChild(auth.currentUser?.uid)) goto('/admin/posts');
						else goto('/');
					}
				});
			});
		}
	}

	function checkEmailAndPassword() {
		if (credential.email.trim() == '') errorMessage += `отсутствует email<br/>`;
		if (!credential.email.includes('@') || !credential.email.includes('.'))
			errorMessage += `email должен содержать символы "@" и "."<br/>`;
		if (credential.password.trim() == '') errorMessage += `пароль не должен быть пустым<br/>`;
		if (credential.password.length < 4)
			errorMessage += `пароль должен состоять минимум из 4 символов<br/>`;
	}
</script>

<div class="d-flex justify-content-center align-items-center" style="height: 100vh;">
	<div class="d-flex flex-column gap-2 bg-white text-dark p-4 rounded" style="min-width:23em;">
		<div class="text-center mb-2">
			<b class="text-uppercase">Вход для администраторов сайта</b>
		</div>

		<div class="text-danger small">{@html errorMessage}</div>

		<div class="d-flex flex-column gap-2">
			<div class="d-flex justify-content-evenly">
				<button
					class="btn btn-dark text-light w-100"
					onclick={() => {
						signInWithPopup(auth, new GoogleAuthProvider())
							.then(result => {
								const credential = GoogleAuthProvider.credentialFromResult(result);
								const token = credential?.accessToken;
								const user = result.user;
								goto('/');
							})
							.catch(error => {
								const errorCode = error.code;
								const errorMessage = error.message;
								const email = error.customData.email;
								const credential = GoogleAuthProvider.credentialFromError(error);
								console.log(error);
							});
					}}>Войти через <b>Google</b></button>
			</div>
			<div class="d-flex align-items-center gap-2">
				<hr class="flex-grow-1" />
				<small class="text-muted pb-1">или</small>
				<hr class="flex-grow-1" />
			</div>
			<div class="input-group">
				<input class="form-control" placeholder="email" bind:value={credential.email} />
			</div>
			<div class="input-group">
				<input
					class="form-control"
					type="password"
					placeholder="пароль"
					bind:value={credential.password} />
			</div>
			<div class="d-flex gap-1 justify-content-between align-items-center">
				<button class="btn btn-light text-dark" onclick={() => goto('/')}>Отмена</button>
				<button class="btn btn-dark text-light" onclick={() => login()}>Войти</button>
			</div>
		</div>
	</div>
</div>
