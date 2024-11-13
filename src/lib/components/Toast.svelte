<script lang="ts">
	import { toastMessage } from '$lib/toastStore';
	import { fade, fly } from 'svelte/transition';

	function closeToast() {
		toastMessage.set(null);
	}
</script>

{#if $toastMessage}
	<div
		class="fixed bottom-4 right-4 w-96 rounded-md border bg-white p-4 text-sm font-semibold shadow-sm"
		in:fly={{ y: 200, duration: 300 }}
		out:fade={{ duration: 300 }}
	>
		<div class="flex items-center justify-between">
			<span>{$toastMessage}</span>
			<button on:click={closeToast} class="ml-4 text-xl text-gray-500 hover:text-gray-800">
				&times;
			</button>
		</div>
	</div>
{/if}
