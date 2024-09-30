<script lang="ts">
	import { isAuthenticated } from '$lib/stores/auth.ts';
	import Switch from '$lib/components/shared/Switch.svelte';
	import type { PageData } from './$types';
	import LoginRegisterModal from '$lib/components/LoginRegisterModal.svelte';

	let data: PageData;
	let form: FormData;

	let showModal = false;
	let modalMode: 'login' | 'register' = 'login';
	let profileRegisterType: 'user' | 'gym' = 'user';
</script>

<!-- <div class="background-video-container">
	<video autoplay loop muted playsinline class="background-video">
		<source src="background-video.mp4" type="video/mp4" />
		Your browser does not support the video tag.
	</video>
</div> -->

<div class="content container">
	{#if $isAuthenticated}
		<h1>Dashboard</h1>
		<div>currently playing songs</div>
		<div></div>
	{:else}
		<div class="switch-container">
			<Switch
				bind:profileRegisterType
				ariaLabeledBy="account-type"
				labelLeft="User"
				labelRight="Gym"
			/>
		</div>
		<div class="text-center">
			<h2>Their gym, our music</h2>
			<p>
				Reccomendations for gym music, tailored to your gym's atmosphere and your clients'
				preferences.
			</p>

			<button
				on:click={() => {
					showModal = true;
					modalMode = 'login';
				}}
			>
				{#if profileRegisterType === 'user'}
					Register
				{:else}
					Register as gym
				{/if}
			</button>
			<button
				class="secondary-button"
				on:click={() => {
					showModal = true;
					modalMode = 'login';
				}}
			>
				{#if profileRegisterType === 'user'}
					Login
				{:else}
					Login
				{/if}
			</button>

			<LoginRegisterModal bind:showModal bind:modalMode bind:profileRegisterType />
		</div>
	{/if}
</div>

<style>
	.background-video-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: -1; /* Ensure the video is behind other content */
	}
	.background-video {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: translate(-50%, -50%);
		opacity: 0.4;
	}
	.content {
		position: relative;
		z-index: 1; /* Ensure content is above the video */
	}

	.switch-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
