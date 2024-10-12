<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import type { DecodedJwtPayload } from '$lib/types/types';
	import type { PageData } from './$types';

	export let data: PageData;
	const user: DecodedJwtPayload | null = data.user;
</script>

<Header {user} />
<slot />
<Footer />
