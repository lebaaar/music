<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	// import { fetchGyms } from '$lib/api'; // Assume you have an API function to fetch gyms

	let showModal = false;
	// let gyms = [];
	let selectedGymId: number | null = null;

	onMount(async () => {
		// gyms = await fetchGyms();
	});

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	async function selectGym() {
		if (selectedGymId) {
			// Assume you have an API function to update the user's gym
			// await updateUserGym(selectedGymId);
			closeModal();
			goto('/app'); // Redirect to the app page
		}
	}
</script>

<button on:click={openModal}>Select Gym</button>

{#if showModal}
	<dialog>
		<h2>Select Your Gym</h2>
		<ul>
			<!-- {#each gyms as gym}
				<li>
					<label>
						<input type="radio" name="gym" value={gym.gymId} bind:group={selectedGymId} />
						{gym.name}
					</label>
				</li>
			{/each} -->
		</ul>
		<div class="button-container">
			<button on:click={selectGym} disabled={!selectedGymId}>Select</button>
			<button on:click={closeModal}>Cancel</button>
		</div>
	</dialog>
{/if}

<style>
	dialog {
		max-width: 90%;
		width: 32rem;
		border-radius: 0.2em;
		border: none;
		padding: 1em;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}

	.button-container {
		display: flex;
		justify-content: space-between;
		margin-top: 1rem;
	}
</style>
