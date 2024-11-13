<script lang="ts">
	const componentPromise = import('../../../lib/components/Edit.svelte');
	export let data;
</script>

{#await componentPromise}
	<div class="flex h-screen items-center justify-center">
		<div class="loader">
			<div class="spinner"></div>
			<p>Loading...</p>
		</div>
	</div>
{:then module}
	<svelte:component this={module.default} {data} />
{:catch error}
	<div class="error-container">
		<p>Error loading page: {error.message}</p>
	</div>
{/await}

<style>
	.loader {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.spinner {
		border: 4px solid #f3f3f3;
		border-top: 4px solid #3498db;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
