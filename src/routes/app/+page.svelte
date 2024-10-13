<script lang="ts">
	export let data;
</script>

{#if data.type === 'user'}
	<p>Welcome back user, {data.account.name}!</p>
	{#each data.recommendedSongs as song}
		<ul>
			<li>{song.album} {song.artist}</li>
		</ul>
	{/each}
{:else if data.type === 'gym'}
	<p>Welcome gym</p>
{/if}
