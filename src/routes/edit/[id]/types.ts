import { z } from 'zod';

export const editSchema = z.object({
	title: z.string().min(3, 'Judul minimal 3 karakter'),
	description: z.string().min(3, 'Deskripsi minimal 3 karakter')
});