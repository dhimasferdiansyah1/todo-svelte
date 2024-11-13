import { fail, message, superValidate } from 'sveltekit-superforms';
import prisma from '$lib/prisma.js';
import { editSchema } from './types.js';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params }) => {
	const todo = await prisma.todo.findUnique({
		where: { id: params.id },
		select: {
			id: true,
			title: true,
			description: true
		}
	});

	if (!todo) {
		return { status: 404, body: { error: 'Todo tidak ditemukan' } };
	}

	const form = await superValidate(todo, zod(editSchema));
	return { form };
};

export const actions = {
	default: async ({ request, params }) => {
		const form = await superValidate(request, zod(editSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await prisma.todo.update({
				where: { id: params.id },
				data: {
					title: form.data.title,
					description: form.data.description
				}
			});

			return message(form, 'Berhasil mengupdate todo');
		} catch (error) {
			console.error(error);
			return fail(500, { form, error: 'Gagal mengupdate todo' });
		}
	}
};
