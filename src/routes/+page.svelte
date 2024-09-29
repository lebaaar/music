<script lang="ts">
	import { isAuthenticated } from '$lib/stores/auth.ts';
	import LoginRegisterModal from '$lib/components/LoginRegisterModal.svelte';
	import type { PageData } from './$types';

	let data: PageData;

	let showLoginResiterModal = false;
</script>

{#if $isAuthenticated}
	<h1>Dashboard</h1>
	<div>currently playing songs</div>
	<div></div>
{:else}
	<div>switch to choose between gym goer and gym owner</div>
	<div>
		some general text and CTA buttons that trigger login signup modal

		<button on:click={() => (showLoginResiterModal = true)}> Login </button>

		<LoginRegisterModal bind:showLoginResiterModal>
			<!-- <div slot="header">Login</div>
			<form>
				<input type="email" placeholder="email" />
				<input type="password" placeholder="password" />
				<button type="submit">Login</button>
			</form> -->
			<h2 slot="header">
				modal
				<small><em>adjective</em> mod·al \ˈmō-dəl\</small>
			</h2>

			<ol class="definition-list">
				<li>of or relating to modality in logic</li>
				<li>
					containing provisions as to the mode of procedure or the manner of taking effect —used of
					a contract or legacy
				</li>
				<li>of or relating to a musical mode</li>
				<li>of or relating to structure as opposed to substance</li>
				<li>
					of, relating to, or constituting a grammatical form or category characteristically
					indicating predication
				</li>
				<li>of or relating to a statistical mode</li>
			</ol>

			<a href="https://www.merriam-webster.com/dictionary/modal">merriam-webster.com</a>
		</LoginRegisterModal>
	</div>
{/if}
