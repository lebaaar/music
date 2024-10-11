<script lang="ts">
	import SignInWithGoogle from './shared/SignInWithGoogle.svelte';
	export let showModal: boolean;
	export let modalMode: 'login' | 'register' = 'login';
	export let profileRegisterType: 'user' | 'gym' = 'user';
	export let form;

	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		{#if modalMode === 'login'}
			<h2>Login</h2>
			{#if profileRegisterType === 'user'}
				<p>Login to your user account</p>
			{:else}
				<p>Login to your gym profile</p>
			{/if}

			<form method="POST" action="?/login">
				{#if form?.missing}<p class="error">The email field is required</p>{/if}
				{#if form?.incorrect}<p class="error">Invalid credentials!</p>{/if}
				<label for="email">Email</label>
				<input type="email" id="email" name="email" required />
				<br />
				<label for="password">Password</label>
				<input type="password" id="password" name="password" required />

				<div class="button-container">
					<button type="submit" class="text-center">Login</button>
				</div>
			</form>

			<div class="my-2">
				<SignInWithGoogle />
			</div>

			<p class="mb-0">
				No account?
				<button class="link-button" on:click={() => (modalMode = 'register')}>Register</button>
			</p>
		{:else}
			<h2>Register</h2>
			{#if profileRegisterType === 'user'}
				<p>Create a new user account</p>
			{:else}
				<p>Create a new gym account</p>
			{/if}

			<form method="POST" action="?/register">
				<label for="name">Name</label>
				<input type="text" id="name" name="name" required />
				<br />
				<label for="email">Email</label>
				<input type="email" id="email" name="email" required />
				<br />
				<label for="password">Password</label>
				<input type="password" id="password" name="password" required />

				<div class="button-container">
					<button type="submit" class="text-center">Register</button>
				</div>
			</form>

			<div class="my-2">
				<SignInWithGoogle />
			</div>

			<p class="mb-0">
				Already a member?
				<button class="link-button" on:click={() => (modalMode = 'login')}>Login</button>
			</p>
		{/if}

		{#if form?.invalid || form?.incorrect || form?.missing}
			<p>Invalid creds</p>
		{/if}
	</div>
</dialog>

<style>
	dialog {
		max-width: 90%;
		width: 32rem;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
	.button-container {
		display: flex;
		justify-content: center;
		margin-top: 1rem;
	}
	.link-button {
		display: inline;
		padding: 0;
		background: none;
		border: none;
		color: var(--primary-color);
		cursor: pointer;
	}
	.link-button:hover {
		text-decoration: underline;
	}
</style>
