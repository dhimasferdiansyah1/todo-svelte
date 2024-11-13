<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { showToast } from '$lib/toastStore';

	export let data;

	let searchTerm = $page.url.searchParams.get('search') || '';
	let searchTimeout: ReturnType<typeof setTimeout>;
	let itemsPerPage = Number($page.url.searchParams.get('limit')) || 10; // Default limit

	function handleSearch() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			const params = new URLSearchParams($page.url.search);
			if (searchTerm) {
				params.set('search', searchTerm);
				params.delete('page');
			} else {
				params.delete('search');
			}
			goto(`?${params.toString()}`, { keepFocus: true });
		}, 300); // Reduced debounce time
	}

	function changePage(newPage: number) {
		const params = new URLSearchParams($page.url.search);
		params.set('page', newPage.toString());
		goto(`?${params.toString()}`, { keepFocus: true });
	}

	function changeItemsPerPage(event: Event) {
		if (event.target) {
			itemsPerPage = Number((event.target as HTMLSelectElement).value);
		}
		const params = new URLSearchParams($page.url.search);
		params.set('limit', itemsPerPage.toString());
		params.delete('page'); // Reset to the first page
		goto(`?${params.toString()}`, { keepFocus: true });
	}

	// Fungsi untuk membuat range halaman
	function getPaginationRange() {
		const { currentPage, totalPages } = data.pagination;
		const delta = 1; // Jumlah halaman di sekitar halaman saat ini
		const left = currentPage - delta;
		const right = currentPage + delta;
		const range = [];
		const rangeWithDots = [];
		let l;

		for (let i = 1; i <= totalPages; i++) {
			if (i === 1 || i === totalPages || (i >= left && i <= right)) {
				range.push(i);
			}
		}

		for (let i of range) {
			if (l) {
				if (i - l === 2) {
					rangeWithDots.push(l + 1);
				} else if (i - l !== 1) {
					rangeWithDots.push('...');
				}
			}
			rangeWithDots.push(i);
			l = i;
		}

		return rangeWithDots;
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-semibold">Sveltekit Todos</h1>
		<div class="relative w-full max-w-md">
			<input
				type="text"
				placeholder="Search todos..."
				bind:value={searchTerm}
				on:input={handleSearch}
				class="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			/>
			<div class="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-500">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-search"
					><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
				>
			</div>
		</div>
		<div>
			<label for="items-per-page" class="mr-2 text-gray-700">Show:</label>
			<select
				id="items-per-page"
				on:change={changeItemsPerPage}
				class="rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
			>
				<option value="5">5</option>
				<option value="10">10</option>
				<option value="20">20</option>
				<option value="50">50</option>
			</select>
		</div>
		<a
			href="/add"
			class="ml-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
		>
			Add Todo
		</a>
	</div>

	{#if data.todos.length > 0}
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Title</th
						>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Description</th
						>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Created At</th
						>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Actions</th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#each data.todos as todo (todo.id)}
						<tr>
							<td class="whitespace-nowrap px-6 py-4">{todo.title}</td>
							<td class="whitespace-nowrap px-6 py-4">{todo.description}</td>
							<td class="whitespace-nowrap px-6 py-4"
								>{todo.createdAt.toLocaleDateString('en-GB', {
									day: 'numeric',
									month: 'short',
									year: 'numeric'
								})}</td
							>
							<td class="flex gap-2 whitespace-nowrap px-6 py-4">
								<a href={`/edit/${todo.id}`} class="text-blue-500 hover:text-blue-700">Edit</a>
								<form
									method="POST"
									action="?/delete"
									use:enhance={() => {
										return ({ result, update }) => {
											if (result.type === 'success') {
												showToast('Todo deleted successfully');
												update();
											}
										};
									}}
								>
									<input type="hidden" name="id" value={todo.id} />
									<button type="submit" class="text-red-500 hover:text-red-700">Delete</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p class="text-center text-gray-500">No todos found</p>
	{/if}

	{#if data.pagination.totalPages > 1}
		<div class="mt-6 flex items-center justify-center space-x-2">
			<!-- Previous Button -->
			<button
				on:click={() => changePage(data.pagination.currentPage - 1)}
				disabled={data.pagination.currentPage === 1}
				class="rounded-md bg-gray-200 px-3 py-1 disabled:opacity-50"
			>
				Previous
			</button>

			<!-- Page Buttons -->
			{#each getPaginationRange() as page}
				{#if page === '...'}
					<span class="px-3 py-1">...</span>
				{:else}
					<button
						on:click={() => changePage(Number(page))}
						class={`rounded-md px-3 py-1 ${
							data.pagination.currentPage === page
								? 'bg-blue-500 text-white'
								: 'bg-gray-200 hover:bg-gray-300'
						}`}
					>
						{page}
					</button>
				{/if}
			{/each}

			<!-- Next Button -->
			<button
				on:click={() => changePage(data.pagination.currentPage + 1)}
				disabled={data.pagination.currentPage === data.pagination.totalPages}
				class="rounded-md bg-gray-200 px-3 py-1 disabled:opacity-50"
			>
				Next
			</button>
		</div>
	{/if}
</div>
