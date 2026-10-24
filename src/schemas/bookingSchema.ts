// src/schemas/bookingSchema.ts
import { z } from 'zod';

export const bookingSchema = z.object({
  sessionId: z.string().min(1, 'Session is required'),
  scheduledAt: z.string().min(1, 'Please select a date and time'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
