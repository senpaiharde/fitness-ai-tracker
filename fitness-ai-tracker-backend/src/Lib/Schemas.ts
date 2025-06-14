import { z } from 'zod';

export const logUserEntryZod = z.object({
  workout: z
    .object({
      type: z.string(),
      weightKg: z.number().optional(),
      reps: z.number().optional(),
      time: z.string().optional(),
    })
    .optional(),
  studyMinutes: z.number().optional(),
  foodPlan: z.string().optional(),
  gaming: z
    .object({
      game: z.string(),
      minutes: z.number(),
      time: z.string().optional(),
    })
    .optional(),
  injection: z
    .object({
      compound: z.string(),
      doseMg: z.number(),
      time: z.string().optional(),
    })
    .optional(),
});

export type LogUserEntry = z.infer<typeof logUserEntryZod>;

export const logUserEntrySchema = {
  name: 'logUserEntry',
  description: 'Extract structured daily entry fields from user text',
  parameters: {
    type: 'object',
    properties: {
      workout: {
        type: 'object',
        properties: {
          type:     { type: 'string', description: 'e.g. bench press' },
          weightKg: { type: 'number', description: 'weight in kg' },
          reps:     { type: 'number', description: 'number of reps' },
          time:     { type: 'string', description: 'ISO time or HH:MM' }
        },
        required: ['type']
      },
      studyMinutes: {
        type: 'number',
        description: 'Total minutes spent studying'
      },
      foodPlan: {
        type: 'string',
        description: 'Planned or logged food details'
      },
      gaming: {
        type: 'object',
        properties: {
          game:    { type: 'string', description: 'Game title' },
          minutes: { type: 'number', description: 'Minutes played' },
          time:    { type: 'string', description: 'Time of gameplay' }
        },
        required: ['game','minutes']
      },
      injection: {
        type: 'object',
        properties: {
          compound: { type: 'string', description: 'Compound name' },
          doseMg:   { type: 'number', description: 'Dose in mg' },
          time:     { type: 'string', description: 'Injection time' }
        },
        required: ['compound','doseMg']
      }
    },
   
    required: []
  }
};
