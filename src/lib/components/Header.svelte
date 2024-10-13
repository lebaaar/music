<script lang="ts">
	import type { UserJwtPayload, GymJwtPayload } from '$lib/types/types';

	let isDropdownOpen = false;
	const toggleDropdown = () => {
		isDropdownOpen = !isDropdownOpen;
	};

	export let account: UserJwtPayload | GymJwtPayload | null = null;
</script>

<header class="container mt-2">
	{#if account}
		<form method="POST" action="/logout">
			<button type="submit" class="link-button">Logout</button>
		</form>
	{/if}

	<div class="row d-flex justify-content-center align-items-center">
		<div class="col-6 text-center">
			<h1 class="m-0">
				<a href="/app">Gym music</a>
			</h1>
		</div>
		<div class="col-6 text-end">
			<img src="default-user.png" class="avatar rounded-circle" style="width: 3rem;" alt="Avatar" />
			{#if isDropdownOpen}
				<div class="dropdown-container">
					<ul class="dropdown-menu">
						<li><a href="/profile">Profile</a></li>
						<li><a href="/settings">Settings</a></li>
						<li><a href="/logout">Logout</a></li>
					</ul>
				</div>
			{/if}
		</div>
	</div>
</header>

<style>
	.avatar {
		padding: 0.25rem;
		border: 1px solid var(--black);
	}
	.avatar:hover {
		cursor: pointer;
	}

	.dropdown-container {
		position: absolute;
		top: 3.5rem;
		right: 0;
		background-color: white;
		border: 1px solid #ddd;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		border-radius: 0.25rem;
		z-index: 100;
		width: 150px;
	}

	.dropdown-menu {
		list-style-type: none;
		padding: 0;
		margin: 0;
	}

	.dropdown-menu li {
		padding: 0.5rem;
	}

	.dropdown-menu li:hover {
		background-color: #f1f1f1;
	}

	.dropdown-menu li a {
		text-decoration: none;
		color: #333;
		display: block;
		width: 100%;
	}
</style>
