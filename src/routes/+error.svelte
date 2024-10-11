<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Error</title>
</svelte:head>

<h1 class="text-center">{$page.status}</h1>
<div class="text-center">
	{$page.error?.message}
</div>
