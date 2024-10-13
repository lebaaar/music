<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import type { DecodedUserJwtPayload, DecodedGymJwtPayload } from '$lib/types/types';
	import type { PageData } from './$types';

	export let data: PageData;
	const account: DecodedUserJwtPayload | DecodedGymJwtPayload | null = data.account;
</script>

<Header {account} />
<slot />
<Footer />
