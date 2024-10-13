<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import type { UserJwtPayload, GymJwtPayload } from '$lib/types/types';
	import type { PageData } from './$types';

	export let data: PageData;
	let account: UserJwtPayload | GymJwtPayload | null = data.account;
	$: account = data.account;
</script>

<Header {account} />
<slot />
<Footer />
