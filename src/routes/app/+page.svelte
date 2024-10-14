<script lang="ts">
	import SelectGym from '$lib/components/SelectGym.svelte';

	export let data;
	// console.log(data);
</script>

{#if data.type === 'user'}
	<!-- User account -->
	<p>Welcome back user, {data.account.name}!</p>

	{#if 'gym' in data.account && !data.account.gym}
		<p>Select your gym</p>
		<SelectGym />
	{/if}
	{#each data.recommendedSongs as song}
		<ul>
			<li>{song.album} {song.artist}</li>
		</ul>
	{/each}
{:else if data.type === 'gym'}
	<!-- Gym account -->
	<p>Welcome gym</p>
{/if}
