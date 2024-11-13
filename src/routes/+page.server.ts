import type { PageServerLoad, Actions } from './$types';
import prisma from '$lib/prisma';
import { fail } from 'sveltekit-superforms';

export const load = (async ({ url }) => {
	const page = Number(url.searchParams.get('page') || 1);
	const search = url.searchParams.get('search') || '';
	const limit = Number(url.searchParams.get('limit')) || 5; // Ambil limit dari URL, default 5
	const offset = (page - 1) * limit;

	// Optimasi query dengan select spesifik dan include minimal
	const todos = await prisma.todo.findMany({
		where: {
			OR: [
				{ title: { contains: search, mode: 'insensitive' } },
				{ description: { contains: search, mode: 'insensitive' } }
			]
		},
		select: {
			id: true,
			title: true,
			description: true,
			createdAt: true
		},
		take: limit,
		skip: offset,
		orderBy: { createdAt: 'desc' }
	});

	// Hitung total untuk pagination
	const totalTodos = await prisma.todo.count({
		where: {
			OR: [
				{ title: { contains: search, mode: 'insensitive' } },
				{ description: { contains: search, mode: 'insensitive' } }
			]
		}
	});

	return {
		todos,
		pagination: {
			currentPage: page,
			totalPages: Math.ceil(totalTodos / limit),
			totalTodos,
			limit // Kembalikan limit juga
		}
	};
}) satisfies PageServerLoad;

export const actions = {
	delete: async ({ request }) => {
		try {
			const formData = await request.formData();
			const id = formData.get('id');

			if (!id) {
				return fail(400, { message: 'ID is required' });
			}

			// Contoh penghapusan dengan Prisma
			await prisma.todo.delete({
				where: {
					id: String(id)
				}
			});

			return { success: true };
		} catch (error) {
			console.error('Delete error:', error);
			return fail(500, {
				message: 'Failed to delete todo',
				error: error instanceof Error ? error.message : 'Unknown error'
			});
		}
	}
} satisfies Actions;
