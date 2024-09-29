<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Error</title>
</svelte:head>

<h1>{$page.status}</h1>
<span>
	{$page.error?.message}
</span>
