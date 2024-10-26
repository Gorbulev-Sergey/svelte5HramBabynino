<script>
	import { goto } from '$app/navigation';
	import { auth, db } from '$lib/scripts/firebase';
	import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
	import { onValue, ref } from 'firebase/database';

	let credential = { email: '', password: '' };
	let errorMessage = '';
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
		if (credential.password.length < 4) errorMessage += `пароль должен состоять минимум из 4 символов<br/>`;
	}
</script>

<div class="d-flex justify-content-center align-items-center" style="height: 100vh;">
	<div class="bg-light text-dark p-3 rounded" style="min-width:23em;">
		<div class="mb-2 text-center">
			<b class="text-uppercase">Вход для администраторов сайта</b>
		</div>
		<div class="text-danger small">{@html errorMessage}</div>
		<div class="mt-4">
			<div class="input-group mb-2">
				<input class="form-control" placeholder="email" bind:value={credential.email} />
			</div>
			<div class="input-group mb-4">
				<input class="form-control" type="password" placeholder="пароль" bind:value={credential.password} />
			</div>
			<div class="d-flex gap-1 justify-content-between align-items-center">
				<button class="btn btn-dark text-light" on:click={() => login()}>Войти</button>

				<button class="btn btn-light text-dark" on:click={() => goto('/')}>Отмена</button>
			</div>
		</div>
		<div class="d-flex align-items-center gap-2 my-1">
			<hr class="flex-grow-1" />
			<small class="text-muted pb-1">или</small>
			<hr class="flex-grow-1" />
		</div>
		<div class="d-flex justify-content-evenly">
			<button
				class="btn btn-dark text-light w-100"
				on:click={() => {
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
						});
				}}>Войти через Google</button>
		</div>
	</div>
</div>
