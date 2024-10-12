<script lang="ts">
	import Switch from '$lib/components/shared/Switch.svelte';
	import type { ActionData, PageData } from './$types';
	import LoginRegisterModal from '$lib/components/LoginRegisterModal.svelte';
	export let form: ActionData;

	let showModal = false;
	let modalMode: 'login' | 'register' = 'login';
	let profileRegisterType: 'user' | 'gym' = 'user';

	if (form?.invalid === true && form?.modalMode) {
		modalMode = form.modalMode as 'login' | 'register';
		showModal = true;
	}
</script>

<!-- <div class="background-video-container">
	<video autoplay loop muted playsinline class="background-video">
		<source src="background-video.mp4" type="video/mp4" />
		Your browser does not support the video tag.
	</video>
</div> -->

<div class="content container">
	<div class="switch-container">
		<Switch
			bind:profileRegisterType
			ariaLabeledBy="account-type"
			labelLeft="User"
			labelRight="Gym"
		/>
	</div>
	<div class="text-center">
		<h2>Reccomend gym music</h2>
		<p>
			Reccomendations for gym music, tailored to your gym's atmosphere and your clients'
			preferences.
		</p>

		<button
			on:click={() => {
				showModal = true;
				modalMode = 'register';
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

		<LoginRegisterModal bind:showModal bind:modalMode bind:profileRegisterType bind:form />
	</div>
</div>

<style>
	/* .background-video-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: -1;
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
	} */
	.content {
		position: relative;
		z-index: 1;
	}

	.switch-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
