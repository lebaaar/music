<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import type { ActionResult } from '@sveltejs/kit';
	import type { ActionData } from '../../routes/$types';
	import SignInWithGoogle from './shared/SignInWithGoogle.svelte';
	export let showModal: boolean;
	export let modalMode: 'login' | 'register' = 'login';
	export let profileRegisterType: 'user' | 'gym' = 'user';
	export let form: ActionData | null = null;

	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();

	function clearErrors() {
		if (form) {
			form.success = undefined as any;
			form.missing = false;
			form.message = null;
			form.errorMessage = null;
		}
	}

	async function handleSubmit() {
		return async ({ result }: { result: ActionResult }) => {
			if (result.type === 'redirect') {
				await invalidateAll();
				goto(result.location);
			} else {
				await applyAction(result);
			}
		};
	}
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

			<form method="POST" action="?/login" use:enhance={handleSubmit}>
				<input type="hidden" name="accountType" id="accountType" value={profileRegisterType} />
				<label for="email">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					required
					value={form?.email ?? ''}
					on:input={clearErrors}
				/>
				<br />
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					value={form?.password ?? ''}
					on:input={clearErrors}
				/>

				<div class="button-container">
					<button type="submit" class="text-center">Login</button>
				</div>
			</form>

			{#if profileRegisterType === 'user'}
				<div class="my-2">
					<SignInWithGoogle />
				</div>
			{/if}

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

			<form method="POST" action="?/register" use:enhance={handleSubmit}>
				<input type="hidden" name="accountType" id="accountType" value={profileRegisterType} />
				<label for="name">Name</label>
				<input type="text" id="name" name="name" required value={form?.name ?? ''} />
				<br />
				<label for="email">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					required
					value={form?.email ?? ''}
					on:input={clearErrors}
				/>
				<br />
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					value={form?.password ?? ''}
					on:input={clearErrors}
				/>

				<div class="button-container">
					<button type="submit" class="text-center">Register</button>
				</div>
			</form>

			{#if profileRegisterType === 'user'}
				<div class="my-2">
					<SignInWithGoogle />
				</div>
			{/if}

			<p class="mb-0">
				Already a member?
				<button class="link-button" on:click={() => (modalMode = 'login')}>Login</button>
			</p>
		{/if}

		{#if form?.missing}
			<p class="error">Email and password are required</p>
		{/if}
		{#if form?.success === false}
			{#if form?.message}
				<p>{form.message}</p>
			{:else if form?.errorMessage}
				<p class="error">{form.errorMessage}</p>
			{:else}
				<p class="error">Invalid creds</p>
			{/if}
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
