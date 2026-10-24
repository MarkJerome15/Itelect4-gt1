// src/schemas/reviewSchema.ts
import { z } from 'zod';

// The same two limits as aiRequestSchema in backend, with the
// same messages, so the browser validates before a request is sent.
export const reviewFormSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(20, 'Describe your project in at least 20 characters.')
    .max(2000, 'Keep the description under 2000 characters.'),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
