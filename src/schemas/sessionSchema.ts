// src/schemas/sessionSchema.ts
// Zod v4 validation schema for the Peer Tutoring Session create/edit form.
import { z } from 'zod';

export const STATUS_OPTIONS = [
  { value: 'available',   label: 'Available' },
  { value: 'planned',     label: 'Planned' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed',   label: 'Completed' },
  { value: 'cancelled',   label: 'Cancelled' },
] as const;

export const SUBJECT_OPTIONS = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English & Writing',
  'General Tutoring',
] as const;

export const sessionSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),

  subject: z
    .string()
    .min(2, 'Subject must be at least 2 characters')
    .max(50, 'Subject cannot exceed 50 characters'),

  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),

  status: z.enum(['available', 'planned', 'in-progress', 'completed', 'cancelled'], {
    error: 'Please select a valid status',
  }),

  ratePerHour: z
    .number({ error: 'Rate must be a number' })
    .min(0, 'Rate per hour cannot be negative')
    .max(500, 'Rate cannot exceed $500/hr'),

  durationMinutes: z
    .number({ error: 'Duration must be a number' })
    .int('Duration must be a whole number')
    .min(15, 'Duration must be at least 15 minutes')
    .max(480, 'Duration cannot exceed 480 minutes (8 hours)'),

  availableSlots: z
    .number({ error: 'Slots must be a number' })
    .int('Slots must be a whole number')
    .min(1, 'At least 1 slot must be available')
    .max(50, 'Max 50 slots'),

  notes: z
    .string()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional(),
});

export type SessionFormValues = z.infer<typeof sessionSchema>;
