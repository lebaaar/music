<script lang="ts">
	export let labelLeft;
	export let labelRight: string | null = null;
	export let ariaLabeledBy = 'switch';
	export let profileRegisterType = 'user';

	let checked = false;

	function handleClick(event: { target: any }) {
		const target = event.target;

		const state = target.getAttribute('aria-checked');
		checked = state === 'true' ? false : true;
		profileRegisterType = checked === true ? 'gym' : 'user';
	}
</script>

<div class="s s--slider">
	<span id={`switch-${ariaLabeledBy}`}>{labelLeft}</span>
	<button
		role="switch"
		aria-checked={checked}
		aria-labelledby={`switch-${ariaLabeledBy}`}
		on:click={handleClick}
	>
	</button>
	{#if labelRight}
		<span id={`switch-${ariaLabeledBy}`}>{labelRight}</span>
	{/if}
</div>

<style>
	.s--slider {
		display: flex;
		align-items: center;
	}

	.s--slider button {
		width: 3em;
		height: 1.6em;
		position: relative;
		margin: 0.5em;
		background: var(--gray);
		border: none;
	}

	.s--slider button::before {
		content: '';
		position: absolute;
		width: 1.3em;
		height: 1.3em;
		background: #fff;
		top: 0.13em;
		right: 1.5em;
		transition: transform 0.3s;
	}

	.s--slider button[aria-checked='true'],
	.s--slider button[aria-checked='false'] {
		background-color: var(--primary-color);
	}

	.s--slider button[aria-checked='true']::before {
		transform: translateX(1.3em);
		transition: transform 0.3s;
	}

	/* Slider Design Option */
	.s--slider button {
		border-radius: 1.5em;
	}

	.s--slider button::before {
		border-radius: 100%;
	}
</style>
