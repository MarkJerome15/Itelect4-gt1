// src/schemas/bookingSchema.ts
// One schema. The rules live here, and the TypeScript type is DERIVED
// from it -- so a rule and its type can never drift apart.
import { z } from "zod";

export const bookingSchema = z.object({
  // .min(1) is what "required" means for a string: not empty.
  sessionId: z.string().min(1, "Please select a tutoring session."),

  // .min(1) ensures not empty, .refine() adds custom business validation rule
  notes: z
    .string()
    .min(1, "Please enter your study topic or goal.")
    .refine(
      (val) => val.trim().length >= 3,
      "Study topic must be at least 3 characters long."
    ),
});

// z.infer reads the schema and hands back the TypeScript type:
//   { sessionId: string; notes: string }
export type BookingFormValues = z.infer<typeof bookingSchema>;
