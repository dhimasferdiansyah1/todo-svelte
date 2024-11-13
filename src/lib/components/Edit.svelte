<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { editSchema } from '../../routes/edit/[id]/types';
	import { goto } from '$app/navigation';
	import { showToast } from '$lib/toastStore.js';
	export let data;

	const { form, errors, constraints, submitting, enhance } = superForm(
		data.form ?? { title: '', description: '' },
		{
			validators: zodClient(editSchema),
			validationMethod: 'auto',

			onResult: ({ result }) => {
				if (result.type === 'success') {
					showToast('Todo updated successfully');
					setTimeout(() => {
						goto('/');
					}, 0);
				}
			}
		}
	);
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-6 text-2xl font-semibold text-gray-800">Edit Todo</h1>

	<form class="rounded-lg bg-white p-6 shadow-md" method="POST" use:enhance novalidate>
		<div class="mb-4">
			<label for="title" class="block text-sm font-medium text-gray-700">Title</label>
			<input
				id="title"
				name="title"
				bind:value={$form.title}
				{...$constraints.title}
				type="text"
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				placeholder="Enter your title"
			/>
			{#if $errors.title}
				<p class="mt-1 text-sm text-red-500">{$errors.title}</p>
			{/if}
		</div>

		<div class="mb-6">
			<label for="description" class="block text-sm font-medium text-gray-700">Description</label>
			<textarea
				id="description"
				name="description"
				bind:value={$form.description}
				{...$constraints.description}
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				rows="4"
				placeholder="Enter your description"
			></textarea>
			{#if $errors.description}
				<p class="mt-1 text-sm text-red-500">{$errors.description}</p>
			{/if}
		</div>

		<div class="flex justify-end">
			<a
				href="/"
				class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				Cancel
			</a>
			<button
				disabled={$submitting}
				type="submit"
				class="ml-3 inline-flex items-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				{#if $submitting}
					Saving...
				{:else}
					Save
				{/if}
			</button>
		</div>
	</form>
</div>
