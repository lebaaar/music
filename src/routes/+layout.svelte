<script>
	// Svelte
	import { onMount } from 'svelte';
	import 'bootstrap/dist/css/bootstrap.min.css';
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { isAuthenticated } from '$lib/stores/auth';

	onMount(() => {
		// ngOnInit
		// ngOnDestroy
		return () => {};
	});

	onMount(() => {
		if ($isAuthenticated) {
		} else {
		}
	});
</script>

<Header />
<slot />
<Footer />
