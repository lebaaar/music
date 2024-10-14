<script>
	export let data;
</script>

<h1>Account</h1>
{#if data.type === 'user'}
	<p>Hey user {data.account.name}</p>
{:else}
	<p>Hey gym {data.account.name}</p>
{/if}
