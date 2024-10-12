<script lang="ts">
	export let data;
</script>

<div class="text-center">
	<h1>Dashboard</h1>
	<div>currently playing songs</div>
</div>

<p>Welcome back, {data.user.name}!</p>
{#each data.recommendedSongs as song}
	<ul>
		<li>{song.album} {song.artist}</li>
	</ul>
{/each}
