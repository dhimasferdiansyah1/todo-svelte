import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { addSchema } from './types.js';
import prisma from '$lib/prisma.js';

export const load = async () => {
	const form = await superValidate(zod(addSchema));

	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(addSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await prisma.todo.create({
				data: {
					title: form.data.title,
					description: form.data.description
				}
			});

			return message(form, 'Berhasil menambahkan todo');
		} catch (error) {
			console.error(error);
			return fail(500, { form, error: 'Gagal menambahkan todo' });
		}
	}
};
